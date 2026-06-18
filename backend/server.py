import hashlib
import hmac
import io
import logging
import os
import secrets
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Literal

import jwt
import bcrypt
from PIL import Image, UnidentifiedImageError
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    FastAPI,
    File,
    Header,
    HTTPException,
    Request,
    Response,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, field_validator
from pymongo import ASCENDING, DESCENDING


ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("DB_NAME", "ked_prod")
JWT_SECRET = os.getenv("JWT_SECRET", "")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "true").lower() == "true"
PUBLIC_PREFIX = os.getenv("PUBLIC_PREFIX", "/ked-shop")
ALLOWED_ORIGINS = [
    value.strip()
    for value in os.getenv("CORS_ORIGINS", "https://edigital-prod.cloud").split(",")
    if value.strip()
]
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(ROOT_DIR / "uploads"))).resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
ALLOWED_IMAGE_FORMATS = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
}
SESSION_COOKIE = "ked_session"
CSRF_COOKIE = "ked_csrf"
SESSION_HOURS = 12

if len(JWT_SECRET) < 32:
    raise RuntimeError("JWT_SECRET must be configured with at least 32 characters")

client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]
logger = logging.getLogger("ked")


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.command("ping")
    await db.users.create_index("email", unique=True)
    await db.users.create_index([("status", ASCENDING), ("created_at", DESCENDING)])
    await db.profiles.create_index("owner_id", unique=True)
    for collection in (db.products, db.services, db.posts):
        await collection.create_index("id", unique=True)
        await collection.create_index(
            [("status", ASCENDING), ("created_at", DESCENDING)]
        )
        await collection.create_index(
            [("owner_id", ASCENDING), ("updated_at", DESCENDING)]
        )
    await db.inquiries.create_index(
        [("seller_id", ASCENDING), ("created_at", DESCENDING)]
    )
    await db.auth_attempts.create_index("expires_at", expireAfterSeconds=0)
    await db.auth_attempts.create_index(
        [("key", ASCENDING), ("created_at", DESCENDING)]
    )
    logger.info("KED API ready")
    yield
    client.close()


app = FastAPI(
    title="KED Platform API",
    version="1.0.0",
    docs_url="/api/docs" if os.getenv("ENABLE_DOCS", "false").lower() == "true" else None,
    redoc_url=None,
    lifespan=lifespan,
)
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def public_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:16]}"


def clean_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if not document:
        return document
    result = dict(document)
    result.pop("_id", None)
    result.pop("password_hash", None)
    result.pop("reset_token_hash", None)
    return result


def public_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    result = clean_document(document)
    if result:
        result.pop("pending_changes", None)
        result.pop("review_status", None)
    return result


def moderation_view(document: dict[str, Any] | None) -> dict[str, Any] | None:
    result = clean_document(document)
    if not result:
        return result
    pending_changes = result.pop("pending_changes", None)
    if result.pop("review_status", None) == "pending" and pending_changes:
        current_version = dict(result)
        current_version.pop("moderation_note", None)
        published_status = result.get("status")
        result.update(pending_changes)
        result["status"] = "pending"
        result["published_status"] = published_status
        result["review_type"] = "update"
        result["current_version"] = current_version
    elif result.get("status") == "pending":
        result["review_type"] = "new"
    return result


def normalize_email(value: str) -> str:
    return value.strip().lower()


def hash_token(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_password(value: str) -> str:
    return bcrypt.hashpw(value.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")


def verify_password(value: str, password_hash: str) -> bool:
    return bcrypt.checkpw(value.encode("utf-8"), password_hash.encode("utf-8"))


def create_session(user: dict[str, Any]) -> tuple[str, str]:
    csrf_token = secrets.token_urlsafe(32)
    now = utcnow()
    payload = {
        "sub": user["id"],
        "role": user["role"],
        "csrf": csrf_token,
        "iat": now,
        "exp": now + timedelta(hours=SESSION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256"), csrf_token


def set_session_cookies(response: Response, token: str, csrf_token: str) -> None:
    common = {
        "secure": COOKIE_SECURE,
        "samesite": "lax",
        "path": PUBLIC_PREFIX or "/",
        "max_age": SESSION_HOURS * 3600,
    }
    response.set_cookie(SESSION_COOKIE, token, httponly=True, **common)
    response.set_cookie(CSRF_COOKIE, csrf_token, httponly=False, **common)


def clear_session_cookies(response: Response) -> None:
    response.delete_cookie(SESSION_COOKIE, path=PUBLIC_PREFIX or "/")
    response.delete_cookie(CSRF_COOKIE, path=PUBLIC_PREFIX or "/")


async def current_user(
    request: Request,
    ked_session: str | None = Cookie(default=None, alias=SESSION_COOKIE),
) -> dict[str, Any]:
    if not ked_session:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        claims = jwt.decode(ked_session, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Session expired") from exc
    user = await db.users.find_one({"id": claims["sub"]})
    if not user or user.get("status") == "suspended":
        raise HTTPException(status_code=401, detail="Account unavailable")
    user["_claims"] = claims
    request.state.user = user
    return user


async def csrf_protected(
    request: Request,
    user: dict[str, Any] = Depends(current_user),
    csrf_header: str | None = Header(default=None, alias="X-CSRF-Token"),
    csrf_cookie: str | None = Cookie(default=None, alias=CSRF_COOKIE),
) -> dict[str, Any]:
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        expected = user["_claims"].get("csrf", "")
        if not csrf_header or not csrf_cookie:
            raise HTTPException(status_code=403, detail="CSRF token required")
        if not hmac.compare_digest(csrf_header, csrf_cookie) or not hmac.compare_digest(
            csrf_header, expected
        ):
            raise HTTPException(status_code=403, detail="Invalid CSRF token")
    return user


async def active_seller(user: dict[str, Any] = Depends(csrf_protected)) -> dict[str, Any]:
    if user["role"] == "super_admin":
        return user
    if user["role"] != "seller" or user["status"] != "active":
        raise HTTPException(status_code=403, detail="Seller approval required")
    return user


async def super_admin(user: dict[str, Any] = Depends(csrf_protected)) -> dict[str, Any]:
    if user["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Super Admin access required")
    return user


async def audit(
    actor: dict[str, Any],
    action: str,
    entity_type: str,
    entity_id: str,
    metadata: dict[str, Any] | None = None,
) -> None:
    await db.audit_logs.insert_one(
        {
            "id": public_id("audit"),
            "actor_id": actor["id"],
            "actor_email": actor["email"],
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "metadata": metadata or {},
            "created_at": utcnow(),
        }
    )


class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    phone: str = Field(min_length=8, max_length=20)
    business_name: str = Field(min_length=2, max_length=120)
    location: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    bio: str = Field(default="", max_length=1200)
    whatsapp: str = Field(default="", max_length=20)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not any(char.isalpha() for char in value) or not any(
            char.isdigit() for char in value
        ):
            raise ValueError("Password must contain letters and numbers")
        return value


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordInput(BaseModel):
    email: EmailStr


class ResetPasswordInput(BaseModel):
    token: str = Field(min_length=20)
    password: str = Field(min_length=10, max_length=128)


class ChangePasswordInput(BaseModel):
    current_password: str
    new_password: str = Field(min_length=10, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if not any(char.isalpha() for char in value) or not any(
            char.isdigit() for char in value
        ):
            raise ValueError("Password must contain letters and numbers")
        return value


class ProfileInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    business: str = Field(min_length=2, max_length=120)
    tagline: str = Field(default="", max_length=180)
    location: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    story: str = Field(default="", max_length=3000)
    image: str = Field(default="", max_length=500)
    instagram: str = Field(default="", max_length=120)
    whatsapp: str = Field(default="", max_length=20)


class ContentInput(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str = Field(min_length=10, max_length=5000)
    category: str = Field(min_length=2, max_length=80)
    image: str = Field(default="", max_length=500)
    images: list[str] = Field(default_factory=list, max_length=6)
    price: float = Field(default=0, ge=0, le=10_000_000)
    originalPrice: float | None = Field(default=None, ge=0, le=10_000_000)
    tags: list[str] = Field(default_factory=list, max_length=12)
    type: str = Field(default="", max_length=80)
    priceType: str = Field(default="", max_length=80)
    duration: str = Field(default="", max_length=80)
    slots: list[str] = Field(default_factory=list, max_length=20)
    isOnline: bool = False
    title: str = Field(default="", max_length=180)


class InquiryInput(BaseModel):
    entity_type: Literal["product", "service", "profile"]
    entity_id: str
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=8, max_length=20)
    email: EmailStr | None = None
    message: str = Field(default="", max_length=2000)


class ModerationInput(BaseModel):
    status: Literal["active", "approved", "rejected", "suspended", "published"]
    note: str = Field(default="", max_length=1000)


class SettingsInput(BaseModel):
    support_email: EmailStr
    support_phone: str = Field(min_length=8, max_length=20)
    default_whatsapp: str = Field(min_length=8, max_length=20)
    announcement: str = Field(default="", max_length=300)


CONTENT_COLLECTIONS = {
    "products": ("product", db.products),
    "services": ("service", db.services),
    "posts": ("post", db.posts),
}
ADMIN_COLLECTIONS = {
    **CONTENT_COLLECTIONS,
    "profiles": ("profile", db.profiles),
}


def content_collection(content_type: str):
    if content_type not in CONTENT_COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown content type")
    return CONTENT_COLLECTIONS[content_type]


def admin_collection(content_type: str):
    if content_type not in ADMIN_COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown content type")
    return ADMIN_COLLECTIONS[content_type]


@api.get("/health")
async def health() -> dict[str, str]:
    await db.command("ping")
    return {"status": "ok", "service": "ked-api"}


@api.post("/auth/register", status_code=201)
async def register(payload: RegisterInput) -> dict[str, Any]:
    email = normalize_email(str(payload.email))
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account already exists for this email")
    now = utcnow()
    user_id = public_id("usr")
    profile_id = public_id("profile")
    user = {
        "id": user_id,
        "name": payload.name.strip(),
        "email": email,
        "phone": payload.phone.strip(),
        "password_hash": hash_password(payload.password),
        "role": "seller",
        "status": "pending",
        "profile_id": profile_id,
        "created_at": now,
        "updated_at": now,
    }
    profile = {
        "id": profile_id,
        "owner_id": user_id,
        "name": payload.name.strip(),
        "business": payload.business_name.strip(),
        "tagline": "",
        "location": payload.location.strip(),
        "category": payload.category.strip(),
        "story": payload.bio.strip(),
        "image": "",
        "social": {
            "instagram": "",
            "whatsapp": (payload.whatsapp or payload.phone).strip(),
        },
        "verified": False,
        "status": "pending",
        "badges": ["Women-Led"],
        "rating": 0,
        "reviews": 0,
        "created_at": now,
        "updated_at": now,
    }
    await db.users.insert_one(user)
    await db.profiles.insert_one(profile)
    return {
        "message": "Application submitted. A Super Admin must approve the seller account.",
        "status": "pending",
    }


@api.post("/auth/login")
async def login(payload: LoginInput, response: Response, request: Request) -> dict[str, Any]:
    email = normalize_email(str(payload.email))
    client_ip = request.client.host if request.client else "unknown"
    attempt_key = hash_token(f"{client_ip}:{email}")
    recent_attempts = await db.auth_attempts.count_documents(
        {
            "key": attempt_key,
            "created_at": {"$gt": utcnow() - timedelta(minutes=10)},
        }
    )
    if recent_attempts >= 10:
        raise HTTPException(
            status_code=429,
            detail="Too many sign-in attempts. Try again in 10 minutes.",
        )
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.auth_attempts.insert_one(
            {
                "key": attempt_key,
                "created_at": utcnow(),
                "expires_at": utcnow() + timedelta(minutes=10),
            }
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user["status"] == "suspended":
        raise HTTPException(status_code=403, detail="This account is suspended")
    token, csrf_token = create_session(user)
    await db.auth_attempts.delete_many({"key": attempt_key})
    set_session_cookies(response, token, csrf_token)
    return {"user": clean_document(user), "csrf_token": csrf_token}


@api.post("/auth/logout")
async def logout(response: Response) -> dict[str, str]:
    clear_session_cookies(response)
    return {"message": "Signed out"}


@api.get("/auth/me")
async def me(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    return {"user": clean_document(user), "csrf_token": user["_claims"]["csrf"]}


@api.post("/auth/forgot-password")
async def forgot_password(payload: ForgotPasswordInput) -> dict[str, str]:
    user = await db.users.find_one({"email": normalize_email(str(payload.email))})
    if user:
        token = secrets.token_urlsafe(32)
        await db.users.update_one(
            {"id": user["id"]},
            {
                "$set": {
                    "reset_token_hash": hash_token(token),
                    "reset_expires_at": utcnow() + timedelta(minutes=30),
                }
            },
        )
        logger.warning(
            "Password reset requested for %s. Configure transactional email before enabling delivery.",
            user["email"],
        )
    return {"message": "If the account exists, password reset instructions will be sent."}


@api.post("/auth/reset-password")
async def reset_password(payload: ResetPasswordInput) -> dict[str, str]:
    user = await db.users.find_one(
        {
            "reset_token_hash": hash_token(payload.token),
            "reset_expires_at": {"$gt": utcnow()},
        }
    )
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "password_hash": hash_password(payload.password),
                "updated_at": utcnow(),
            },
            "$unset": {"reset_token_hash": "", "reset_expires_at": ""},
        },
    )
    return {"message": "Password updated"}


@api.post("/auth/change-password")
async def change_password(
    payload: ChangePasswordInput,
    user: dict[str, Any] = Depends(csrf_protected),
) -> dict[str, str]:
    if not verify_password(payload.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="Choose a different password")
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "password_hash": hash_password(payload.new_password),
                "updated_at": utcnow(),
            }
        },
    )
    await audit(user, "change_password", "user", user["id"])
    return {"message": "Password changed successfully"}


@api.get("/public/bootstrap")
async def public_bootstrap() -> dict[str, Any]:
    profiles = [
        public_document(item)
        async for item in db.profiles.find({"status": "published"}).sort("created_at", DESCENDING)
    ]
    profile_map = {item["id"]: item for item in profiles}
    products = [
        public_document(item)
        async for item in db.products.find({"status": "published"}).sort("created_at", DESCENDING)
    ]
    services = [
        public_document(item)
        async for item in db.services.find({"status": "published"}).sort("created_at", DESCENDING)
    ]
    posts = [
        public_document(item)
        async for item in db.posts.find({"status": "published"}).sort("created_at", DESCENDING)
    ]
    workshops = [
        public_document(item)
        async for item in db.workshops.find({"status": "published"}).sort("date", ASCENDING)
    ]
    for item in products:
        item["seller"] = profile_map.get(item.get("profile_id"), {})
    for item in services:
        item["provider"] = profile_map.get(item.get("profile_id"), {})
    for item in posts:
        item["founder"] = profile_map.get(item.get("profile_id"), {})
        item["excerpt"] = item.get("excerpt") or item.get("description", "")
        item["readTime"] = item.get("readTime") or "3 min read"
        created_at = item.get("published_at") or item.get("created_at")
        item["date"] = item.get("date") or (
            created_at.strftime("%B %Y") if isinstance(created_at, datetime) else ""
        )
    settings = clean_document(await db.settings.find_one({"id": "platform"})) or {}
    return {
        "founders": profiles,
        "products": products,
        "services": services,
        "posts": posts,
        "workshops": workshops,
        "settings": settings,
    }


@api.get("/seller/dashboard")
async def seller_dashboard(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    profile = moderation_view(await db.profiles.find_one({"owner_id": user["id"]}))
    counts = {}
    for name, (_, collection) in CONTENT_COLLECTIONS.items():
        counts[name] = {
            "total": await collection.count_documents({"owner_id": user["id"]}),
            "pending": await collection.count_documents(
                {
                    "owner_id": user["id"],
                    "$or": [{"status": "pending"}, {"review_status": "pending"}],
                }
            ),
            "published": await collection.count_documents(
                {"owner_id": user["id"], "status": "published"}
            ),
        }
    inquiries = [
        clean_document(item)
        async for item in db.inquiries.find({"seller_id": user["id"]})
        .sort("created_at", DESCENDING)
        .limit(100)
    ]
    return {"profile": profile, "counts": counts, "inquiries": inquiries}


@api.put("/seller/profile")
async def update_profile(
    payload: ProfileInput, user: dict[str, Any] = Depends(active_seller)
) -> dict[str, Any]:
    existing = await db.profiles.find_one({"owner_id": user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")
    values = payload.model_dump()
    values["social"] = {
        "instagram": values.pop("instagram"),
        "whatsapp": values.pop("whatsapp"),
    }
    now = utcnow()
    if existing.get("status") == "published":
        await db.profiles.update_one(
            {"id": existing["id"]},
            {
                "$set": {
                    "pending_changes": values,
                    "review_status": "pending",
                    "moderation_note": "",
                    "updated_at": now,
                }
            },
        )
    else:
        values.update({"status": "pending", "verified": False, "updated_at": now})
        await db.profiles.update_one({"id": existing["id"]}, {"$set": values})
    await audit(user, "submit_profile", "profile", existing["id"])
    return moderation_view(await db.profiles.find_one({"id": existing["id"]}))


@api.get("/seller/content/{content_type}")
async def list_seller_content(
    content_type: str, user: dict[str, Any] = Depends(current_user)
) -> list[dict[str, Any]]:
    _, collection = content_collection(content_type)
    return [
        moderation_view(item)
        async for item in collection.find({"owner_id": user["id"]}).sort(
            "updated_at", DESCENDING
        )
    ]


@api.post("/seller/content/{content_type}", status_code=201)
async def create_seller_content(
    content_type: str,
    payload: ContentInput,
    user: dict[str, Any] = Depends(active_seller),
) -> dict[str, Any]:
    singular, collection = content_collection(content_type)
    profile = await db.profiles.find_one({"owner_id": user["id"]})
    if not profile:
        raise HTTPException(status_code=400, detail="Seller profile is required")
    data = payload.model_dump()
    if content_type == "posts":
        data["title"] = data["title"] or data["name"]
    item_id = public_id(singular)
    now = utcnow()
    data.update(
        {
            "id": item_id,
            "owner_id": user["id"],
            "profile_id": profile["id"],
            "status": "pending",
            "moderation_note": "",
            "created_at": now,
            "updated_at": now,
        }
    )
    await collection.insert_one(data)
    await audit(user, f"create_{singular}", singular, item_id)
    return clean_document(data)


@api.put("/seller/content/{content_type}/{item_id}")
async def update_seller_content(
    content_type: str,
    item_id: str,
    payload: ContentInput,
    user: dict[str, Any] = Depends(active_seller),
) -> dict[str, Any]:
    singular, collection = content_collection(content_type)
    query = {"id": item_id}
    if user["role"] != "super_admin":
        query["owner_id"] = user["id"]
    existing = await collection.find_one(query)
    if not existing:
        raise HTTPException(status_code=404, detail="Content not found")
    values = payload.model_dump()
    if content_type == "posts":
        values["title"] = values["title"] or values["name"]
    now = utcnow()
    if existing.get("status") == "published":
        await collection.update_one(
            {"id": item_id},
            {
                "$set": {
                    "pending_changes": values,
                    "review_status": "pending",
                    "moderation_note": "",
                    "updated_at": now,
                }
            },
        )
    else:
        values.update({"status": "pending", "moderation_note": "", "updated_at": now})
        await collection.update_one({"id": item_id}, {"$set": values})
    await audit(user, f"update_{singular}", singular, item_id)
    return moderation_view(await collection.find_one({"id": item_id}))


@api.delete("/seller/content/{content_type}/{item_id}", status_code=204)
async def delete_seller_content(
    content_type: str,
    item_id: str,
    user: dict[str, Any] = Depends(active_seller),
) -> Response:
    singular, collection = content_collection(content_type)
    query = {"id": item_id}
    if user["role"] != "super_admin":
        query["owner_id"] = user["id"]
    result = await collection.delete_one(query)
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Content not found")
    await audit(user, f"delete_{singular}", singular, item_id)
    return Response(status_code=204)


@api.post("/uploads", status_code=201)
async def upload_image(
    file: UploadFile = File(...),
    user: dict[str, Any] = Depends(active_seller),
) -> dict[str, str]:
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(status_code=415, detail="Only JPG, PNG, and WebP images are allowed")
    contents = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 5MB or smaller")
    try:
        with Image.open(io.BytesIO(contents)) as image:
            image.verify()
            if image.format != ALLOWED_IMAGE_FORMATS[file.content_type or ""]:
                raise HTTPException(status_code=415, detail="Image content does not match its type")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=415, detail="The uploaded file is not a valid image") from exc
    digest = hashlib.sha256(contents).hexdigest()[:24]
    filename = f"{user['id']}-{digest}{extension}"
    destination = (UPLOAD_DIR / filename).resolve()
    if destination.parent != UPLOAD_DIR:
        raise HTTPException(status_code=400, detail="Invalid upload path")
    destination.write_bytes(contents)
    return {"url": f"{PUBLIC_PREFIX}/uploads/{filename}"}


@api.post("/inquiries", status_code=201)
async def create_inquiry(payload: InquiryInput, request: Request) -> dict[str, Any]:
    entity_collection = {
        "product": db.products,
        "service": db.services,
        "profile": db.profiles,
    }[payload.entity_type]
    entity = await entity_collection.find_one(
        {"id": payload.entity_id, "status": "published"}
    )
    if not entity:
        raise HTTPException(status_code=404, detail="Listing not found")
    seller_id = entity.get("owner_id")
    profile = await db.profiles.find_one({"owner_id": seller_id})
    inquiry = {
        "id": public_id("lead"),
        **payload.model_dump(),
        "seller_id": seller_id,
        "profile_id": profile.get("id") if profile else None,
        "ip_hash": hash_token(request.client.host if request.client else "unknown"),
        "status": "new",
        "created_at": utcnow(),
    }
    await db.inquiries.insert_one(inquiry)
    whatsapp = (profile or {}).get("social", {}).get("whatsapp", "")
    return {"id": inquiry["id"], "whatsapp": whatsapp}


@api.get("/admin/overview")
async def admin_overview(
    user: dict[str, Any] = Depends(super_admin),
) -> dict[str, Any]:
    return {
        "users": {
            "total": await db.users.count_documents({}),
            "pending": await db.users.count_documents({"status": "pending"}),
            "active": await db.users.count_documents({"status": "active"}),
        },
        "content": {
            name: {
                "total": await collection.count_documents({}),
                "pending": await collection.count_documents(
                    {"$or": [{"status": "pending"}, {"review_status": "pending"}]}
                ),
                "published": await collection.count_documents({"status": "published"}),
            }
            for name, (_, collection) in CONTENT_COLLECTIONS.items()
        },
        "pending_profiles": await db.profiles.count_documents(
            {"$or": [{"status": "pending"}, {"review_status": "pending"}]}
        ),
        "inquiries": await db.inquiries.count_documents({}),
    }


@api.get("/admin/users")
async def admin_users(
    user: dict[str, Any] = Depends(super_admin),
) -> list[dict[str, Any]]:
    results = []
    async for item in db.users.find({}).sort("created_at", DESCENDING):
        result = moderation_view(item)
        profile = await db.profiles.find_one({"owner_id": item["id"]})
        if profile:
            result["profile"] = moderation_view(profile)
        results.append(result)
    return results


@api.patch("/admin/users/{user_id}")
async def moderate_user(
    user_id: str,
    payload: ModerationInput,
    actor: dict[str, Any] = Depends(super_admin),
) -> dict[str, Any]:
    if payload.status not in {"active", "rejected", "suspended"}:
        raise HTTPException(status_code=422, detail="Invalid account status")
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target["role"] == "super_admin":
        raise HTTPException(status_code=400, detail="Super Admin cannot be moderated here")
    await db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "status": payload.status,
                "moderation_note": payload.note,
                "updated_at": utcnow(),
            }
        },
    )
    profile_status = "published" if payload.status == "active" else payload.status
    await db.profiles.update_one(
        {"owner_id": user_id},
        {
            "$set": {
                "status": profile_status,
                "verified": payload.status == "active",
                "moderation_note": payload.note,
                "updated_at": utcnow(),
            }
        },
    )
    await audit(actor, f"{payload.status}_user", "user", user_id, {"note": payload.note})
    return clean_document(await db.users.find_one({"id": user_id}))


@api.get("/admin/content/{content_type}")
async def admin_content(
    content_type: str,
    user: dict[str, Any] = Depends(super_admin),
) -> list[dict[str, Any]]:
    _, collection = admin_collection(content_type)
    results = []
    async for item in collection.find({}).sort("updated_at", DESCENDING):
        result = moderation_view(item)
        owner = await db.users.find_one({"id": item.get("owner_id")})
        profile = await db.profiles.find_one({"owner_id": item.get("owner_id")})
        result["submitted_by"] = {
            "id": item.get("owner_id"),
            "name": (owner or {}).get("name", ""),
            "email": (owner or {}).get("email", ""),
            "business": (profile or {}).get("business", ""),
        }
        results.append(result)
    return results


@api.patch("/admin/content/{content_type}/{item_id}")
async def moderate_content(
    content_type: str,
    item_id: str,
    payload: ModerationInput,
    actor: dict[str, Any] = Depends(super_admin),
) -> dict[str, Any]:
    singular, collection = admin_collection(content_type)
    if payload.status not in {"published", "rejected"}:
        raise HTTPException(status_code=422, detail="Invalid content status")
    existing = await collection.find_one({"id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Content not found")
    now = utcnow()
    pending_changes = existing.get("pending_changes")
    if pending_changes:
        if payload.status == "published":
            approved = {
                **pending_changes,
                "status": "published",
                "moderation_note": payload.note,
                "updated_at": now,
                "published_at": now,
            }
            if content_type == "profiles":
                approved["verified"] = True
            update = {
                "$set": approved,
                "$unset": {"pending_changes": "", "review_status": ""},
            }
        else:
            update = {
                "$set": {"moderation_note": payload.note, "updated_at": now},
                "$unset": {"pending_changes": "", "review_status": ""},
            }
    else:
        values = {
            "status": payload.status,
            "moderation_note": payload.note,
            "updated_at": now,
            "published_at": now if payload.status == "published" else None,
        }
        if content_type == "profiles":
            values["verified"] = payload.status == "published"
        update = {"$set": values}
    await collection.update_one({"id": item_id}, update)
    await audit(
        actor, f"{payload.status}_{singular}", singular, item_id, {"note": payload.note}
    )
    return moderation_view(await collection.find_one({"id": item_id}))


@api.get("/admin/inquiries")
async def admin_inquiries(
    user: dict[str, Any] = Depends(super_admin),
) -> list[dict[str, Any]]:
    return [
        clean_document(item)
        async for item in db.inquiries.find({}).sort("created_at", DESCENDING).limit(500)
    ]


@api.get("/admin/settings")
async def get_settings(
    user: dict[str, Any] = Depends(super_admin),
) -> dict[str, Any]:
    return clean_document(await db.settings.find_one({"id": "platform"})) or {}


@api.put("/admin/settings")
async def update_settings(
    payload: SettingsInput,
    actor: dict[str, Any] = Depends(super_admin),
) -> dict[str, Any]:
    values = payload.model_dump(mode="json")
    values.update({"id": "platform", "updated_at": utcnow()})
    await db.settings.update_one({"id": "platform"}, {"$set": values}, upsert=True)
    await audit(actor, "update_settings", "settings", "platform")
    return clean_document(await db.settings.find_one({"id": "platform"}))


app.include_router(api)
