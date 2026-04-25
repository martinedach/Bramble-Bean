# Cafe review

A small web app for a local cafe to collect customer feedback: email, free-text comment, a 1–5 rating, and which aspect of the visit the customer enjoyed most (food, coffee, service, or atmosphere).

This repository is being built for a developer assessment. Scope, architecture, and a delivery checklist live in **[PLANNING.md](./PLANNING.md)**.

## Planned stack

| Area | Choice |
|------|--------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4 |
| Backend | FastAPI |
| Database | PostgreSQL |
| Delivery | Docker Compose (app + database); FastAPI serves the built SPA for a single-origin setup |

## Status

End-to-end **customer feedback** flow: **`POST /api/feedback`** persists to PostgreSQL; the React form validates email (regex), rating (1–5), and highlight (Food / Coffee / Service / Atmosphere), then submits JSON to the API. **`GET /api/health`** remains for checks.

Run the full stack with **`docker compose up --build`** (or **`make start`**) and open **http://localhost:8000**.

The app image build now runs verification before it can succeed:
- Frontend: `npm run lint` and `npm run build`
- Backend: `pytest`

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
| `make test` | Run backend tests in the running `app` container (`pytest -q`); starts `app`/`db` if needed |
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

- **Database only:** `docker compose up db` (Postgres on port **5432** with user/password/db `cafe`).
- **Backend:** from `backend/`, create a venv (Python **3.12 or 3.13** recommended), `pip install -r requirements.txt`, set `DATABASE_URL` (see [`.env.example`](./.env.example)), then `uvicorn main:app --reload --host 127.0.0.1 --port 8000`. API routes live under **`/api/*`**.
- **Frontend:** `cd frontend && npm install && npm run dev`. Vite proxies **`/api`** to **`http://127.0.0.1:8000`**, so keep the API on port 8000 while using the dev server. Styling uses **Tailwind v4** and Pinterest-inspired tokens; see **[frontend/DESIGN_SCHEMA.md](./frontend/DESIGN_SCHEMA.md)**.
- **API tests:** from `backend/`, `python -m pytest tests/ -v`. If `DATABASE_URL` is unset, tests use in-memory SQLite (same models; production still uses Postgres). To hit Postgres instead, export `DATABASE_URL` before pytest.
- **Static UI from the API:** run `npm run build` in `frontend`, copy `frontend/dist` into `backend/static`, then serve with uvicorn as above, or use Docker for the combined image.

## Documentation

- [PLANNING.md](./PLANNING.md) — stack rationale, API and data model drafts, Makefile section (git-tracked), and tickable delivery checklist.
