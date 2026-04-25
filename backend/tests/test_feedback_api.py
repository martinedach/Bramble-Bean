from fastapi.testclient import TestClient

from main import app


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
