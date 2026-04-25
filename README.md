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
- [GNU Make](https://www.gnu.org/software/make/) (optional; only if you use the Makefile shortcuts below)

## Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Then open **http://localhost:8000** for the UI (static build served by FastAPI) and **http://localhost:8000/api/health** for the health JSON.

PostgreSQL is exposed on **localhost:5432** (user `cafe`, password `cafe`, database `cafe`) for local tools. These credentials are for development only.

Stop the stack (containers removed; **named volume `pgdata` is kept** so the database survives):

```bash
docker compose down
```

To remove containers **and** volumes (wipe the database):

```bash
docker compose down -v
```

## Make commands

The repo root **[Makefile](./Makefile)** wraps the same Compose file (`compose.yaml`, project name `cafe-review`). Run `make` or `make help` to print this list.

| Command | What it does |
|---------|----------------|
| `make` / `make help` | Show available targets |
| `make start` or `make up` | `docker compose up -d --build` |
| `make stop` or `make down` | `docker compose down` (volumes kept) |
| `make restart` | `make stop` then `make start` |
| `make build` | Build images without starting containers |
| `make logs` | Follow logs (`--tail=100`) |
| `make ps` | List running Compose services |
| `make down-volumes` | `docker compose down -v` (removes **`pgdata`**; destructive) |

Override the compose file if needed:

```bash
make start COMPOSE_FILE=docker-compose.yml
```

## Configuration

Copy [`.env.example`](./.env.example) to `.env` when you run the app outside Compose or need overrides. The Compose file sets `DATABASE_URL` for the `app` service automatically.

## Local development (without full Docker)

- **Frontend:** `cd frontend && npm install && npm run dev`
- **Backend:** create a virtualenv, `pip install -r backend/requirements.txt`, then from `backend/` run `uvicorn main:app --reload --port 8000`. Without a `static/` folder next to `main.py`, only API routes (for example `/api/health`) are available until you run `npm run build` in `frontend` and copy `frontend/dist` to `backend/static`, or use Docker.

## Documentation

- [PLANNING.md](./PLANNING.md) — stack rationale, API and data model drafts, Makefile section (git-tracked), and tickable delivery checklist.
