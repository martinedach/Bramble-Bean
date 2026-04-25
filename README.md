# Cafe review

A small web app for a local cafe to collect customer feedback: email, free-text comment, a 1–5 rating, and which aspect of the visit the customer enjoyed most (food, coffee, service, or atmosphere).

This repository is being built for a developer assessment. Scope, architecture, and a delivery checklist live in **[PLANNING.md](./PLANNING.md)**.

## Planned stack

| Area | Choice |
|------|--------|
| Frontend | React, TypeScript, Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| Delivery | Docker Compose (app + database); FastAPI serves the built SPA for a single-origin setup |

## Status

Infra is in place: multi-stage **Dockerfile** (Vite build + FastAPI), **Compose** stack (`app` + `db`), and a minimal API with **`GET /api/health`**. Feedback persistence and **`POST /api/feedback`** are not implemented yet.

## Requirements

- [Docker](https://docs.docker.com/get-docker/) with Compose v2 (`docker compose`)

## Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Or use the Makefile:

```bash
make start
```

Then open **http://localhost:8000** for the UI (static build served by FastAPI) and **http://localhost:8000/api/health** for the health JSON.

PostgreSQL is exposed on **localhost:5432** (user `cafe`, password `cafe`, database `cafe`) for local tools. These credentials are for development only.

Stop the stack:

```bash
docker compose down
# or
make stop
```

Containers are removed; the named volume **`pgdata`** keeps database data until you remove it with `docker compose down -v`.

## Configuration

Copy [`.env.example`](./.env.example) to `.env` when you run the app outside Compose or need overrides. The Compose file sets `DATABASE_URL` for the `app` service automatically.

## Local development (without full Docker)

- **Frontend:** `cd frontend && npm install && npm run dev`
- **Backend:** create a virtualenv, `pip install -r backend/requirements.txt`, then from `backend/` run `uvicorn main:app --reload --port 8000`. Without a `static/` folder next to `main.py`, only API routes (for example `/api/health`) are available until you run `npm run build` in `frontend` and copy `frontend/dist` to `backend/static`, or use Docker.

## Documentation

- [PLANNING.md](./PLANNING.md) — stack rationale, API and data model drafts, Makefile plan, and tickable delivery checklist.
