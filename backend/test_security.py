import importlib
import os

import jwt
import pytest
from pydantic import ValidationError


os.environ.setdefault("JWT_SECRET", "test-secret-that-is-longer-than-thirty-two-characters")
os.environ.setdefault("COOKIE_SECURE", "false")
os.environ.setdefault("PUBLIC_PREFIX", "/ked-shop")

server = importlib.import_module("server")


def test_session_token_contains_role_and_csrf():
    token, csrf = server.create_session(
        {"id": "usr_test", "role": "seller", "email": "seller@example.com"}
    )
    claims = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
    assert claims["sub"] == "usr_test"
    assert claims["role"] == "seller"
    assert claims["csrf"] == csrf
    assert len(csrf) >= 32


def test_registration_requires_strong_password():
    with pytest.raises(ValidationError):
        server.RegisterInput(
            name="Test Seller",
            email="seller@example.com",
            password="onlyletters",
            phone="+919999999999",
            business_name="Test Business",
            location="Bhuj, Gujarat",
            category="Craft",
        )


def test_upload_types_are_restricted():
    assert server.ALLOWED_IMAGE_TYPES == {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }


def test_content_collection_rejects_unknown_type():
    with pytest.raises(server.HTTPException) as exc:
        server.content_collection("orders")
    assert exc.value.status_code == 404


def test_pending_changes_are_hidden_from_public_output():
    document = {
        "id": "product_test",
        "status": "published",
        "name": "Live name",
        "pending_changes": {"name": "Pending name"},
        "review_status": "pending",
    }
    output = server.public_document(document)
    assert output["name"] == "Live name"
    assert "pending_changes" not in output
    assert "review_status" not in output


def test_moderation_view_exposes_pending_edit_without_changing_live_status():
    document = {
        "id": "product_test",
        "status": "published",
        "name": "Live name",
        "pending_changes": {"name": "Pending name"},
        "review_status": "pending",
    }
    output = server.moderation_view(document)
    assert output["name"] == "Pending name"
    assert output["status"] == "pending"
    assert output["published_status"] == "published"
