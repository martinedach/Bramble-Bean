from fastapi.testclient import TestClient

from main import app


def _first_error_for_field(response_json: dict, field: str) -> dict | None:
    for err in response_json.get("detail", []):
        loc = err.get("loc", [])
        if isinstance(loc, list) and len(loc) >= 2 and loc[-1] == field:
            return err
    return None


def test_create_feedback_returns_201() -> None:
    with TestClient(app) as client:
        r = client.post(
            "/api/feedback",
            json={
                "email": "patron@example.com",
                "comment": "Lovely atmosphere and coffee.",
                "rating": 5,
                "highlight": "Coffee",
            },
        )
    assert r.status_code == 201
    data = r.json()
    assert data["id"] >= 1
    assert data["email"] == "patron@example.com"
    assert data["comment"] == "Lovely atmosphere and coffee."
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
