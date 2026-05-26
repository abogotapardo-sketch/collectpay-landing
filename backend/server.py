from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Form
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
import bcrypt
import jwt
import re
import asyncio
import base64
import resend


# ============================================================
# Setup
# ============================================================
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(title="CollectPay API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")


# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response


app.add_middleware(SecurityHeadersMiddleware)

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ============================================================
# Helpers
# ============================================================
# Resend email configuration
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
LEADS_EMAIL = os.environ.get("LEADS_EMAIL", "marketing@collectpay.co")
CAREERS_EMAIL = os.environ.get("CAREERS_EMAIL", "hola@collectpay.co")


async def send_lead_notification(submission: dict) -> bool:
    """Send lead notification email to marketing team. Non-blocking."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not configured - skipping email notification")
        return False
    
    name = submission.get('name', 'N/A')
    email = submission.get('email', 'N/A')
    phone = submission.get('phone', 'N/A')
    company = submission.get('company', 'N/A')
    plan = submission.get('plan', 'No especificado')
    message = submission.get('message', 'Sin mensaje')
    submitted_at = submission.get('submitted_at', '')
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <tr>
                <td style="background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Nuevo lead - CollectPay</h1>
                    <p style="color: #cffafe; margin: 8px 0 0 0; font-size: 14px;">Solicitud de demo recibida</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 32px 24px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                        <tr><td style="font-weight: bold; color: #475569; width: 140px;">Nombre:</td><td style="color: #0f172a;">{name}</td></tr>
                        <tr style="background: #f1f5f9;"><td style="font-weight: bold; color: #475569;">Empresa:</td><td style="color: #0f172a;">{company}</td></tr>
                        <tr><td style="font-weight: bold; color: #475569;">Email:</td><td><a href="mailto:{email}" style="color: #0891b2; text-decoration: none;">{email}</a></td></tr>
                        <tr style="background: #f1f5f9;"><td style="font-weight: bold; color: #475569;">Teléfono:</td><td><a href="tel:{phone}" style="color: #0891b2; text-decoration: none;">{phone}</a></td></tr>
                        <tr><td style="font-weight: bold; color: #475569;">Plan de interés:</td><td><span style="background: #cffafe; color: #0e7490; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">{plan}</span></td></tr>
                        <tr style="background: #f1f5f9;"><td style="font-weight: bold; color: #475569;">Recibido:</td><td style="color: #64748b; font-size: 13px;">{submitted_at}</td></tr>
                    </table>
                    
                    <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-left: 4px solid #0891b2; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; font-weight: bold; color: #475569; font-size: 13px;">MENSAJE:</p>
                        <p style="margin: 0; color: #0f172a; white-space: pre-wrap;">{message}</p>
                    </div>
                    
                    <table width="100%" style="margin-top: 32px;">
                        <tr>
                            <td align="center">
                                <a href="mailto:{email}" style="background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                    Responder a {name.split()[0] if name else 'lead'}
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="background: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
                    <p style="margin: 0;">CollectPay - Sistema de notificación de leads</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [LEADS_EMAIL],
        "subject": f"🎯 Nuevo lead: {company} ({name})",
        "html": html,
        "reply_to": email
    }
    
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Lead notification sent: {result.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send lead notification: {e}")
        return False


def sanitize_string(s: str, max_length: int = 500) -> str:
    """Remove potentially dangerous chars and limit length."""
    if not isinstance(s, str):
        return ""
    # Strip script tags & control chars
    s = re.sub(r'<script[^>]*>.*?</script>', '', s, flags=re.IGNORECASE | re.DOTALL)
    s = re.sub(r'[\x00-\x1f\x7f]', '', s)
    return s.strip()[:max_length]


# ============================================================
# Auth Helpers
# ============================================================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============================================================
# Models
# ============================================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: str
    plan: Optional[str] = ""
    message: Optional[str] = ""
    # Anti-spam fields (server-issued token)
    captcha_token: Optional[str] = ""
    captcha_answer: Optional[str] = ""
    honeypot: Optional[str] = ""
    form_started_at: Optional[int] = 0


class CaptchaResponse(BaseModel):
    a: int
    b: int
    token: str


# ============================================================
# Auth Endpoints
# ============================================================
@api_router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, req: LoginRequest, response: Response):
    email = req.email.lower().strip()
    
    # Brute force protection
    identifier = f"login:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        last_attempt = attempts.get("last_attempt")
        if last_attempt:
            # Ensure timezone-aware comparison
            if last_attempt.tzinfo is None:
                last_attempt = last_attempt.replace(tzinfo=timezone.utc)
            if (datetime.now(timezone.utc) - last_attempt) < timedelta(minutes=15):
                raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": datetime.now(timezone.utc)}},
            upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Clear failed attempts
    await db.login_attempts.delete_one({"identifier": identifier})
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    
    response.set_cookie(
        key="access_token", value=access_token, httponly=True,
        secure=True, samesite="none", max_age=28800, path="/"
    )
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin"),
        "access_token": access_token
    }


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


# ============================================================
# Content Endpoints
# ============================================================
@api_router.get("/content")
async def get_content(lang: str = "es"):
    """Get current landing page content. Public endpoint."""
    lang = lang if lang in ["es", "en"] else "es"
    content = await db.content.find_one({"_id": "landing"})
    if not content:
        return {}
    content.pop("_id", None)
    # Return language-specific content if available
    if lang in content:
        return content[lang]
    return content.get("es", {})


@api_router.put("/content")
async def update_content(
    payload: Dict[str, Any],
    lang: str = "es",
    current_user: dict = Depends(get_current_user)
):
    """Update landing page content. Admin only."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    lang = lang if lang in ["es", "en"] else "es"
    
    await db.content.update_one(
        {"_id": "landing"},
        {"$set": {lang: payload, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    return {"message": "Content updated", "lang": lang}


# ============================================================
# Contact Form Endpoint
# ============================================================
@api_router.get("/captcha", response_model=CaptchaResponse)
@limiter.limit("30/minute")
async def get_captcha(request: Request):
    """Generate a server-signed captcha. Returns numbers + signed token."""
    import random
    a = random.randint(1, 9)
    b = random.randint(1, 9)
    expected = a + b
    # Token contains the expected answer + expiry, signed
    payload = {
        "ans": expected,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
        "type": "captcha"
    }
    token = jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)
    return CaptchaResponse(a=a, b=b, token=token)


@api_router.post("/contact")
@limiter.limit("10/minute")
async def submit_contact(request: Request, submission: ContactSubmission):
    """Save contact form submission with anti-spam protection."""
    import time
    
    # Anti-spam check 1: Honeypot field must be empty
    if submission.honeypot and submission.honeypot.strip():
        logger.warning(f"Spam - honeypot filled: {get_remote_address(request)}")
        return {"message": "Solicitud recibida", "id": "spam-filtered"}
    
    # Anti-spam check 2: Server-side captcha verification (JWT signed)
    if not submission.captcha_token or not submission.captcha_answer:
        raise HTTPException(status_code=400, detail="Verificación requerida.")
    try:
        captcha_payload = jwt.decode(submission.captcha_token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if captcha_payload.get("type") != "captcha":
            raise HTTPException(status_code=400, detail="Token inválido.")
        expected_answer = captcha_payload.get("ans")
        if str(submission.captcha_answer).strip() != str(expected_answer).strip():
            raise HTTPException(status_code=400, detail="Verificación incorrecta. Por favor intenta de nuevo.")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Verificación expirada. Por favor recarga el captcha.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Token de verificación inválido.")
    
    # Anti-spam check 3: Time-check (bots fill instantly)
    if submission.form_started_at:
        elapsed_ms = int(time.time() * 1000) - submission.form_started_at
        if elapsed_ms < 2000:
            logger.warning(f"Spam - too fast: {elapsed_ms}ms from {get_remote_address(request)}")
            return {"message": "Solicitud recibida", "id": "spam-filtered"}
    
    doc = submission.model_dump(exclude={"captcha_token", "captcha_answer", "honeypot", "form_started_at"})
    for field in ["name", "company", "plan", "message"]:
        if field in doc and doc[field]:
            doc[field] = sanitize_string(doc[field], max_length=2000 if field == "message" else 200)
    doc["submitted_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    doc["ip"] = get_remote_address(request)
    result = await db.contact_submissions.insert_one(doc)
    
    try:
        await send_lead_notification(doc)
    except Exception as e:
        logger.error(f"Email notification error: {e}")
    
    return {"message": "Solicitud recibida", "id": str(result.inserted_id)}


@api_router.get("/contact/submissions")
async def get_submissions(current_user: dict = Depends(get_current_user)):
    """Get all contact submissions. Admin only."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    submissions = await db.contact_submissions.find({}).sort("submitted_at", -1).to_list(1000)
    for sub in submissions:
        sub["_id"] = str(sub["_id"])
    return submissions


@api_router.get("/")
async def root():
    return {"message": "CollectPay API", "status": "running"}


# ============================================================
# Careers (Apply with CV) Endpoint
# ============================================================
@api_router.post("/careers/apply")
@limiter.limit("5/minute")
async def apply_career(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    position: Optional[str] = Form(""),
    message: Optional[str] = Form(""),
    cv: UploadFile = File(...)
):
    """Receive job application with CV. Sends email to careers inbox."""
    # Validate email
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        raise HTTPException(status_code=400, detail="Email inválido")
    
    # Validate file
    allowed_types = ["application/pdf", "application/msword", 
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if cv.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF o Word")
    
    # Read file content
    content = await cv.read()
    file_size = len(content)
    
    # Size limit: 5MB
    if file_size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="El archivo no puede superar 5MB")
    if file_size < 100:
        raise HTTPException(status_code=400, detail="Archivo inválido")
    
    name = sanitize_string(name, 200)
    position = sanitize_string(position, 200)
    message = sanitize_string(message, 2000)
    
    # Save submission to DB
    doc = {
        "name": name,
        "email": email.lower(),
        "position": position or "No especificado",
        "message": message or "",
        "cv_filename": cv.filename,
        "cv_size_kb": round(file_size / 1024, 1),
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "ip": get_remote_address(request),
        "status": "new"
    }
    result = await db.career_applications.insert_one(doc)
    
    # Send email with attachment via Resend
    try:
        await send_career_application(doc, content, cv.filename, cv.content_type)
    except Exception as e:
        logger.error(f"Failed to send career email: {e}")
    
    return {"message": "Aplicación enviada", "id": str(result.inserted_id)}


async def send_career_application(submission: dict, cv_bytes: bytes, filename: str, content_type: str) -> bool:
    """Send career application email with CV attachment."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set - skipping career email")
        return False
    
    name = submission.get('name', 'N/A')
    email = submission.get('email', 'N/A')
    position = submission.get('position', 'N/A')
    message = submission.get('message', 'Sin mensaje')
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <tr>
                <td style="background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Nueva aplicación de empleo</h1>
                    <p style="color: #cffafe; margin: 8px 0 0 0; font-size: 14px;">CollectPay - Carreras</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 32px 24px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                        <tr><td style="font-weight: bold; color: #475569; width: 140px;">Candidato:</td><td style="color: #0f172a;">{name}</td></tr>
                        <tr style="background: #f1f5f9;"><td style="font-weight: bold; color: #475569;">Email:</td><td><a href="mailto:{email}" style="color: #0891b2; text-decoration: none;">{email}</a></td></tr>
                        <tr><td style="font-weight: bold; color: #475569;">Cargo de interés:</td><td><span style="background: #cffafe; color: #0e7490; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">{position}</span></td></tr>
                        <tr style="background: #f1f5f9;"><td style="font-weight: bold; color: #475569;">CV adjunto:</td><td style="color: #64748b; font-size: 13px;">{filename}</td></tr>
                    </table>
                    <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-left: 4px solid #0891b2; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; font-weight: bold; color: #475569; font-size: 13px;">MENSAJE:</p>
                        <p style="margin: 0; color: #0f172a; white-space: pre-wrap;">{message}</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [CAREERS_EMAIL],
        "subject": f"Nueva aplicación: {position} - {name}",
        "html": html,
        "reply_to": email,
        "attachments": [{
            "filename": filename,
            "content": list(cv_bytes)
        }]
    }
    
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Career application sent: {result.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send career email: {e}")
        return False


@api_router.get("/careers/applications")
async def get_career_applications(current_user: dict = Depends(get_current_user)):
    """Get all career applications. Admin only."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    apps = await db.career_applications.find({}).sort("submitted_at", -1).to_list(1000)
    for a in apps:
        a["_id"] = str(a["_id"])
    return apps


# ============================================================
# Include router
# ============================================================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|.*\.preview\.emergentagent\.com|.*\.collectpay\.(co|ai|com\.co)|app\.collectpay\.co|collectpay\.co|collectpay\.ai|collectpay\.com\.co)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Startup: Seed admin + indexes
# ============================================================
@app.on_event("startup")
async def startup_event():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@collectpay.co").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "CollectPay2026!")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info(f"✅ Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"✅ Admin password updated: {admin_email}")
    else:
        logger.info(f"✅ Admin user exists: {admin_email}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
