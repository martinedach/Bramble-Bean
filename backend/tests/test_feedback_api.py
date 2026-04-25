from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from uuid import uuid4

from main import app


def _first_error_for_field(response_json: dict, field: str) -> dict | None:
    for err in response_json.get("detail", []):
        loc = err.get("loc", [])
        if isinstance(loc, list) and len(loc) >= 2 and loc[-1] == field:
            return err
    return None


def _unique_comment(prefix: str) -> str:
    return f"{prefix} {uuid4().hex[:8]}"


def test_create_feedback_returns_201() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": _unique_comment("Lovely atmosphere and coffee."),
                "rating": 5,
                "highlight": "Coffee",
            },
        )
    assert r.status_code == 201
    data = r.json()
    assert data["id"] >= 1
    assert data["email"] == "patron@example.com"
    assert "Lovely atmosphere and coffee." in data["comment"]
    assert data["rating"] == 5
    assert data["highlight"] == "Coffee"
    assert "created_at" in data


def test_create_feedback_missing_field_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "rating": 3,
                "highlight": "Service",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "comment")
    assert err is not None


def test_create_feedback_invalid_highlight_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": "Hi",
                "rating": 3,
                "highlight": "Parking",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "highlight")
    assert err is not None


def test_create_feedback_invalid_rating_low_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": "Tasty brunch.",
                "rating": 0,
                "highlight": "Food",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "rating")
    assert err is not None


def test_create_feedback_invalid_rating_high_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": "Service was fast.",
                "rating": 6,
                "highlight": "Service",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "rating")
    assert err is not None


def test_create_feedback_invalid_rating_float_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": "Loved the latte art.",
                "rating": 3.5,
                "highlight": "Coffee",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "rating")
    assert err is not None


def test_create_feedback_invalid_email_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron-at-example.com",
                "comment": "Great spot.",
                "rating": 4,
                "highlight": "Atmosphere",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "email")
    assert err is not None
    assert "invalid email format" in err.get("msg", "").lower()


def test_create_feedback_comment_whitespace_only_422() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": "   ",
                "rating": 4,
                "highlight": "Atmosphere",
            },
        )
    assert r.status_code == 422
    err = _first_error_for_field(r.json(), "comment")
    assert err is not None
    assert "empty" in err.get("msg", "").lower()


def test_create_feedback_email_is_normalized_to_lowercase() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "  Patron@Example.COM ",
                "comment": _unique_comment("Great ambiance."),
                "rating": 4,
                "highlight": "Atmosphere",
            },
        )
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "patron@example.com"


def test_create_feedback_duplicate_submission_returns_409() -> None:
    payload = {
        "email": "patron@example.com",
        "comment": _unique_comment("Lovely atmosphere and coffee."),
        "rating": 5,
        "highlight": "Coffee",
    }
    with TestClient(app) as client:
        first = client.post("/api/feedback", json=payload)
        second = client.post("/api/feedback", json=payload)
    assert first.status_code == 201
    assert second.status_code == 409
    assert "duplicate" in second.json().get("detail", "").lower()


def test_create_feedback_db_error_returns_503(monkeypatch) -> None:
    original_commit = Session.commit

    def raise_db_error(self: Session) -> None:
        raise SQLAlchemyError("temporary failure")

    monkeypatch.setattr(Session, "commit", raise_db_error)
    try:
        with TestClient(app) as client:
            r = client.post(
                "/api/feedback",
                json={
                    "email": "patron@example.com",
                    "comment": "Service was excellent.",
                    "rating": 5,
                    "highlight": "Service",
                },
            )
    finally:
        monkeypatch.setattr(Session, "commit", original_commit)

    assert r.status_code == 503
    assert "temporarily unavailable" in r.json().get("detail", "").lower()


def test_list_feedback_returns_newest_first_and_honors_limit() -> None:
    with TestClient(app) as client:
        for idx in range(3):
            created = client.post(
                "/api/feedback",
                json={
                    "email": f"list-order-{idx}@example.com",
                    "comment": _unique_comment(f"Ordered comment {idx}"),
                    "rating": 4,
                    "highlight": "Service",
                },
            )
            assert created.status_code == 201

        listed = client.get("/api/feedback", params={"limit": 2})

    assert listed.status_code == 200
    body = listed.json()
    assert isinstance(body, list)
    assert len(body) == 2
    assert body[0]["id"] > body[1]["id"]


def test_list_feedback_validates_query_params() -> None:
    with TestClient(app) as client:
        r = client.get("/api/feedback", params={"limit": 0})
    assert r.status_code == 422
