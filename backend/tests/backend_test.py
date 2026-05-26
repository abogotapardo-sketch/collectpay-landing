"""
Backend API tests for CollectPay
Tests: auth (login, me), content (GET/PUT with auth), contact (submit + admin list)
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://sme-cash-flow.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@collectpay.co"
ADMIN_PASSWORD = "CollectPay2026!"


@pytest.fixture(scope="session")
def admin_token():
    """Login as admin and return access token."""
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    assert data["role"] == "admin"
    assert data["email"] == ADMIN_EMAIL
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ============================================================
# Auth
# ============================================================
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert isinstance(data["access_token"], str) and len(data["access_token"]) > 20
        assert "id" in data

    def test_login_invalid_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-pass-xyz"}, timeout=15)
        # 401 expected; if brute-force already triggered earlier could be 429 - both acceptable failure modes
        assert r.status_code in (401, 429), r.text

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        # password_hash must not leak
        assert "password_hash" not in data

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_invalid_token(self):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer invalid.token.xyz"}, timeout=15)
        assert r.status_code == 401


# ============================================================
# Content
# ============================================================
class TestContent:
    def test_get_content_public_es(self):
        r = requests.get(f"{API}/content?lang=es", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_get_content_public_en(self):
        r = requests.get(f"{API}/content?lang=en", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_put_content_unauthenticated(self):
        r = requests.put(f"{API}/content?lang=es", json={"hero": {"title": "X"}}, timeout=15)
        assert r.status_code == 401

    def test_put_content_authenticated_and_persisted_es(self, auth_headers):
        # Save current content first, restore after to avoid polluting landing
        original = requests.get(f"{API}/content?lang=es", timeout=15).json()
        try:
            marker = f"TEST_ES_{int(time.time())}"
            payload = {"hero": {"badge": "Badge", "title": marker, "subtitle": "Sub"}}
            r = requests.put(f"{API}/content?lang=es", json=payload, headers=auth_headers, timeout=15)
            assert r.status_code == 200, r.text
            body = r.json()
            assert body.get("lang") == "es"
            g = requests.get(f"{API}/content?lang=es", timeout=15)
            assert g.status_code == 200
            assert g.json()["hero"]["title"] == marker
        finally:
            # Restore (PUT replaces; if original was empty, restore empty payload)
            requests.put(f"{API}/content?lang=es", json=original or {}, headers=auth_headers, timeout=15)

    def test_put_content_authenticated_and_persisted_en(self, auth_headers):
        original = requests.get(f"{API}/content?lang=en", timeout=15).json()
        try:
            marker = f"TEST_EN_{int(time.time())}"
            payload = {"hero": {"badge": "Badge", "title": marker, "subtitle": "Sub"}}
            r = requests.put(f"{API}/content?lang=en", json=payload, headers=auth_headers, timeout=15)
            assert r.status_code == 200
            g_en = requests.get(f"{API}/content?lang=en", timeout=15)
            assert g_en.status_code == 200
            assert g_en.json()["hero"]["title"] == marker
        finally:
            requests.put(f"{API}/content?lang=en", json=original or {}, headers=auth_headers, timeout=15)


# ============================================================
# Contact submissions
# ============================================================
class TestContact:
    submission_marker = f"TEST_LEAD_{int(time.time())}"

    def test_submit_contact_form(self):
        # Valid captcha (matching), no honeypot, form_started_at > 2s in past
        payload = {
            "name": f"{self.submission_marker} User",
            "email": "test_lead@example.com",
            "phone": "+573000000000",
            "company": "TestCo",
            "plan": "starter",
            "message": "Hello from automated test",
            "captcha_answer": "7",
            "captcha_expected": "7",
            "honeypot": "",
            "form_started_at": int(time.time() * 1000) - 5000,
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        # Real submission (not spam-filtered)
        assert data["id"] != "spam-filtered"

    def test_submit_contact_wrong_captcha(self):
        payload = {
            "name": "TEST_WRONG_CAPTCHA",
            "email": "wrong_captcha@example.com",
            "phone": "+573000000001",
            "company": "TestCo",
            "captcha_answer": "999",
            "captcha_expected": "7",
            "honeypot": "",
            "form_started_at": int(time.time() * 1000) - 5000,
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 400, r.text
        body = r.json()
        # Error message present
        assert "detail" in body
        assert "Verificación" in body["detail"] or "incorrect" in body["detail"].lower() or "verif" in body["detail"].lower()

    def test_submit_contact_honeypot_filled_returns_spam_filtered(self):
        payload = {
            "name": "TEST_HONEYPOT",
            "email": "honeypot@example.com",
            "phone": "+573000000002",
            "company": "TestCo",
            "captcha_answer": "5",
            "captcha_expected": "5",
            "honeypot": "i-am-a-bot",
            "form_started_at": int(time.time() * 1000) - 5000,
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        # Silent block: 200 but spam-filtered id
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("id") == "spam-filtered"

    def test_submit_contact_too_fast_returns_spam_filtered(self):
        # form_started_at < 2 seconds ago
        payload = {
            "name": "TEST_TOO_FAST",
            "email": "fast@example.com",
            "phone": "+573000000003",
            "company": "TestCo",
            "captcha_answer": "3",
            "captcha_expected": "3",
            "honeypot": "",
            "form_started_at": int(time.time() * 1000) - 500,  # only 500ms ago
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("id") == "spam-filtered"

    def test_submit_contact_email_failure_doesnt_break_submission(self):
        # RESEND_API_KEY is empty in .env so email send is a silent no-op.
        # Verify submission still saved (id is a real ObjectId-like string).
        payload = {
            "name": f"{self.submission_marker} NoEmailKey",
            "email": "noemail@example.com",
            "phone": "+573000000004",
            "company": "NoEmailCo",
            "plan": "pro",
            "message": "Verifying graceful email no-op",
            "captcha_answer": "8",
            "captcha_expected": "8",
            "honeypot": "",
            "form_started_at": int(time.time() * 1000) - 5000,
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["id"] not in ("spam-filtered", "", None)
        # ObjectId-like (24 hex chars)
        assert len(data["id"]) >= 12

    def test_get_submissions_requires_auth(self):
        r = requests.get(f"{API}/contact/submissions", timeout=15)
        assert r.status_code == 401

    def test_get_submissions_with_auth_returns_list(self, auth_headers):
        r = requests.get(f"{API}/contact/submissions", headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        # Should include the one we just submitted
        names = [s.get("name", "") for s in data]
        assert any(self.submission_marker in n for n in names), f"Submitted lead not found among {len(names)} submissions"
        # _id should be stringified, not ObjectId
        if data:
            assert isinstance(data[0].get("_id"), str)


# ============================================================
# Root
# ============================================================
def test_api_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "running"
