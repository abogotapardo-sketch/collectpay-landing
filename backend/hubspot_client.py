"""
HubSpot CRM integration - Push leads from contact form to HubSpot as Contacts.
Server-to-server, uses Private App access token.
Resilient: if custom properties don't exist, the contact is still created
with the standard fields, and the missing data is appended to the lifecycle notes.
"""
import os
import json
import re
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger(__name__)

HUBSPOT_BASE_URL = "https://api.hubapi.com"


def _split_name(full_name: str) -> tuple[str, str]:
    if not full_name:
        return "", ""
    parts = full_name.strip().split(" ", 1)
    firstname = parts[0]
    lastname = parts[1] if len(parts) > 1 else ""
    return firstname, lastname


def _extract_missing_properties(body_text: str) -> list[str]:
    """Parse HubSpot 400 error body to extract names of properties that don't exist."""
    if "PROPERTY_DOESNT_EXIST" not in body_text:
        return []
    missing = set()
    try:
        # Match both "name":"x" and \"name\":\"x\" (HubSpot returns a JSON-in-JSON body)
        for m in re.findall(r'\\?"name\\?"\s*:\s*\\?"([^"\\]+)\\?"', body_text):
            missing.add(m)
    except Exception:
        return []
    # Filter out anything that's not a HubSpot property identifier (lowercase + underscores)
    return [m for m in missing if re.match(r'^[a-z][a-z0-9_]*$', m)]


def _build_properties(lead: Dict[str, Any]) -> Dict[str, Any]:
    firstname, lastname = _split_name(lead.get("name") or "")
    props: Dict[str, Any] = {
        "email": lead.get("email"),
        "firstname": firstname,
        "lastname": lastname,
    }
    if lead.get("company"):
        props["company"] = lead["company"]
    if lead.get("phone"):
        props["phone"] = lead["phone"]
    if lead.get("plan"):
        props["website_plan_interest"] = lead["plan"]
    if lead.get("message"):
        props["website_message"] = lead["message"]

    props["lifecyclestage"] = os.environ.get("HUBSPOT_LIFECYCLE_STAGE", "lead")
    props["hs_lead_status"] = "NEW"
    return {k: v for k, v in props.items() if v not in (None, "")}


async def create_hubspot_contact(lead: Dict[str, Any]) -> Optional[str]:
    """
    Create (or update if exists) a HubSpot contact for the given lead dict.
    Returns the HubSpot contact ID on success, None on failure.
    Never raises — failures are logged.
    """
    token = (os.environ.get("HUBSPOT_ACCESS_TOKEN") or "").strip()
    if not token:
        logger.info("HUBSPOT_ACCESS_TOKEN not configured — skipping HubSpot sync")
        return None

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    url = f"{HUBSPOT_BASE_URL}/crm/v3/objects/contacts"
    properties = _build_properties(lead)

    async with httpx.AsyncClient(timeout=10.0) as client:
        # Attempt 1: full payload with custom properties
        try:
            response = await client.post(url, json={"properties": properties}, headers=headers)
        except httpx.RequestError as e:
            logger.error(f"HubSpot request error: {e}")
            return None

        if response.status_code in (200, 201):
            return await _on_success(response, lead)

        if response.status_code == 409:
            return await _update_existing_contact(client, lead.get("email"), properties, headers, lead)

        # If properties don't exist → strip them and retry once. Fold them into a note instead.
        if response.status_code == 400:
            missing = _extract_missing_properties(response.text)
            if missing:
                logger.warning(
                    f"HubSpot properties missing in portal: {missing}. "
                    f"Retrying without them (data folded into the contact note)."
                )
                # Capture the data we're about to drop, save to fallback fields
                dropped_data = {p: properties.pop(p) for p in missing if p in properties}
                # Stash into hs_content_membership_notes is invalid; instead create the
                # contact without those props and create an associated Note afterwards.
                try:
                    retry = await client.post(url, json={"properties": properties}, headers=headers)
                except httpx.RequestError as e:
                    logger.error(f"HubSpot retry request error: {e}")
                    return None
                if retry.status_code in (200, 201):
                    contact_id = retry.json().get("id")
                    logger.info(f"HubSpot contact created (after retry): id={contact_id}")
                    # Save the dropped data as an associated Note
                    if dropped_data:
                        await _attach_note(client, contact_id, headers, dropped_data, lead)
                    return contact_id
                if retry.status_code == 409:
                    return await _update_existing_contact(
                        client, lead.get("email"), properties, headers, lead, dropped_data=dropped_data
                    )
                logger.error(
                    f"HubSpot retry failed: status={retry.status_code} body={retry.text[:500]}"
                )
                return None

        logger.error(
            f"HubSpot create failed: status={response.status_code} body={response.text[:500]}"
        )
        return None


async def _on_success(response, lead: Dict[str, Any]) -> str:
    contact_id = response.json().get("id")
    logger.info(f"HubSpot contact created: id={contact_id} email={lead.get('email')}")
    return contact_id


async def _update_existing_contact(
    client: httpx.AsyncClient,
    email: str,
    properties: Dict[str, Any],
    headers: Dict[str, str],
    lead: Dict[str, Any],
    dropped_data: Optional[Dict[str, Any]] = None,
) -> Optional[str]:
    if not email:
        return None
    url = f"{HUBSPOT_BASE_URL}/crm/v3/objects/contacts/{email}?idProperty=email"
    try:
        resp = await client.patch(url, json={"properties": properties}, headers=headers)
    except Exception as e:
        logger.error(f"HubSpot update error: {e}")
        return None

    # Retry without missing props if needed
    if resp.status_code == 400:
        missing = _extract_missing_properties(resp.text)
        if missing:
            logger.warning(f"HubSpot update — properties missing: {missing}. Retrying without them.")
            extra_dropped = {p: properties.pop(p) for p in missing if p in properties}
            try:
                resp = await client.patch(url, json={"properties": properties}, headers=headers)
            except Exception as e:
                logger.error(f"HubSpot update retry error: {e}")
                return None
            # Merge dropped data so we attach a fresh note
            if extra_dropped:
                dropped_data = {**(dropped_data or {}), **extra_dropped}

    if resp.status_code in (200, 201):
        contact_id = resp.json().get("id")
        logger.info(f"HubSpot contact updated: id={contact_id} email={email}")
        if dropped_data:
            await _attach_note(client, contact_id, headers, dropped_data, lead)
        return contact_id

    logger.error(
        f"HubSpot update failed: status={resp.status_code} body={resp.text[:300]}"
    )
    return None


async def _attach_note(
    client: httpx.AsyncClient,
    contact_id: str,
    headers: Dict[str, str],
    dropped_data: Dict[str, Any],
    lead: Dict[str, Any],
):
    """Create a Note attached to the contact with the data we couldn't put in custom props."""
    try:
        body_lines = ["Lead enviado desde formulario web collectpay.co"]
        if dropped_data.get("website_plan_interest"):
            body_lines.append(f"Plan de interés: {dropped_data['website_plan_interest']}")
        if dropped_data.get("website_message"):
            body_lines.append(f"Mensaje: {dropped_data['website_message']}")
        note_body = "\n\n".join(body_lines)

        # Step 1: create the Note
        note_resp = await client.post(
            f"{HUBSPOT_BASE_URL}/crm/v3/objects/notes",
            json={
                "properties": {
                    "hs_note_body": note_body,
                    "hs_timestamp": int(__import__("time").time() * 1000),
                }
            },
            headers=headers,
        )
        if note_resp.status_code not in (200, 201):
            logger.warning(f"HubSpot note create failed: {note_resp.status_code} {note_resp.text[:200]}")
            return
        note_id = note_resp.json().get("id")

        # Step 2: associate the Note with the Contact
        assoc_resp = await client.put(
            f"{HUBSPOT_BASE_URL}/crm/v4/objects/notes/{note_id}/associations/default/contacts/{contact_id}",
            headers=headers,
        )
        if assoc_resp.status_code in (200, 201):
            logger.info(f"HubSpot note attached: note={note_id} contact={contact_id}")
        else:
            logger.warning(f"HubSpot note association failed: {assoc_resp.status_code}")
    except Exception as e:
        logger.warning(f"HubSpot attach note error: {e}")
