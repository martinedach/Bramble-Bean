# Cafe feedback app — planning

## Stack decision

| Layer | Choice | Rationale |
|--------|--------|-----------|
| Frontend | React, TypeScript, Vite | Matches the brief’s suggestion; fast local dev; strong typing for form validation. |
| Backend | FastAPI | Clear request/response models, automatic OpenAPI docs, straightforward validation with Pydantic. |
| Database | PostgreSQL | Fits relational feedback records; widely supported; easy to run locally via Docker. |


## Product scope (from brief)

- Web form in the browser posting to our API.
- Required fields: email (format + regex on frontend), comment (free text), rating (integer 1–5), highlight (one of: Food, Coffee, Service, Atmosphere).
- API validates all fields and returns clear errors when invalid or missing.
- Submissions persisted in PostgreSQL.
- Everything runnable locally with clear instructions; Docker Compose for a **small production-like** setup (see below).

## Architecture (target)

**Deployed / Docker (simple single-host story)**  
FastAPI serves both the **built** Vite app (static files from `dist/`) and the JSON API (e.g. under `/api/...`). One **app** image runs uvicorn; **PostgreSQL** is a separate Compose service (two containers total — keeps DB data and upgrades sane; avoid bundling Postgres inside the app image).

```
Browser
    -> same origin (e.g. http://localhost:8000)
        -> FastAPI: /api/*  ->  persistence -> PostgreSQL
        -> FastAPI: static   ->  SPA (Vite build)
```

**Local development**  
Option A: run Vite dev server for the UI (hot reload) and FastAPI separately; point the browser at Vite and set `VITE_API_URL` (or a Vite proxy) to the API.  
Option B: build the frontend and run only FastAPI — matches Docker behaviour, no HMR.

**Separation of concerns**  
React and FastAPI stay in separate folders and responsibilities; FastAPI is only the static host for compiled assets (same role nginx often plays). We trade away independent scaling of UI vs API, which is acceptable for this brief.

**FastAPI static + SPA routing**  
Register **API routes first**, then `StaticFiles` for assets. If we add client-side routes later, add a **catch-all** that returns `index.html` for paths that are not files or `/api/*`.

**CORS**  
When the UI is served from the **same origin** as the API (FastAPI serving `dist/`), browser requests to `/api/...` usually need **no CORS configuration**. If we use the Vite dev server on another port, enable or proxy CORS for that dev setup only.

- **Single repo**: `frontend/` and `backend/` (or `api/`) at top level; root `README.md` for how to run both; Docker multi-stage build copies `frontend/dist` into the app image.

## Data model (draft)

**Table: `feedback_submissions`**

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID or serial | Primary key |
| `email` | text | Stored as submitted (consider normalisation later; not required for MVP) |
| `comment` | text | Required |
| `rating` | smallint | Check 1–5 |
| `highlight` | text or enum | One of four allowed values; DB check constraint optional |
| `created_at` | timestamptz | Default `now()` |

## API contract (draft)

**`POST /api/feedback`**

- **Body (JSON):** `{ "email", "comment", "rating", "highlight" }`
- **Success:** `201` + body with `id` and maybe echo of stored fields (no need to return full row if we keep response minimal).
- **Validation error:** `422` with FastAPI/Pydantic detail structure (readable field messages).

Optional later (out of scope unless time): `GET` list for admin — brief does not require it.

## Validation strategy

| Field | Frontend | Backend |
|--------|-----------|---------|
| Email | Required + regex before submit | Required + email format (Pydantic `EmailStr` or equivalent) |
| Comment | Required (non-empty trim) | Required, min length optional (e.g. 1) |
| Rating | Required, integer 1–5 (select or controlled input) | Required, `ge=1`, `le=5` |
| Highlight | Required, enum tied to four strings | Enum / Literal validation |

Backend remains the source of truth; frontend validation improves UX and satisfies the brief’s explicit frontend email regex.

## Local development plan

1. **PostgreSQL**: Docker Compose service `postgres` with volume; env vars `DATABASE_URL` for the API.
2. **Backend**: Python 3.11+ (or project standard), `uv` or `venv` + `pip`, run with `uvicorn`; migration tool optional — for minimal scope, SQLAlchemy `create_all` on startup is acceptable if we document it; Alembic if we want a clearer story.
3. **Frontend**: `npm create vite@latest` with React-TS template; `npm run build` produces `dist/` for FastAPI to mount.
4. **Docker**: Multi-stage image — stage 1 builds the frontend; stage 2 installs Python deps, copies app + `dist/`, runs uvicorn. Compose file: `app` + `postgres` (two services).
5. **README**: Prerequisites, copy `.env.example`, document how to bring the stack up (see Makefile below); smoke-test one submission; document the dev workflow (Vite + API vs API-only + built assets).

## Makefile

Root **Makefile** wraps Docker Compose (`compose.yaml`, `COMPOSE_PROJECT_NAME=cafe-review`).

- **`make start`** / **`make up`** — `docker compose up -d --build`
- **`make stop`** / **`make down`** — `docker compose down` (volumes kept)
- **`make restart`**, **`make logs`**, **`make ps`**, **`make build`**, **`make help`**
- Override: `make start COMPOSE_FILE=docker-compose.yml`

## Implementation phases

1. **Scaffold** — Vite React TS app; FastAPI app with health route, static mount for `dist/` (after first build); Docker Compose for Postgres + app image wiring; env wiring; root Makefile (`start` / `stop`) wrapping Compose.
2. **Persistence** — Model + table; `POST /api/feedback` insert.
3. **Validation** — Pydantic model + aligned TS types; regex email on client; error display for API 422.
4. **UX polish** — Accessible form, loading/disabled state on submit, success confirmation.
5. **Quality** — Small test set: e.g. one API test for happy path, one for missing field; optional frontend test for validation helper if low cost.
6. **Docs** — README runbook; this file updated if scope changes.

## Delivery checklist (tick as you go)

Use `- [ ]` / `- [x]` in GitHub or your editor to track progress.

### Repository and layout

- [x] Monorepo layout agreed (`frontend/`, `backend/`, root `README.md`, optional `compose.yaml`).
- [x] `.gitignore` covers Python, Node, env files, IDE noise, and local DB volumes if any.
- [x] No secrets committed; `.env.example` lists required variables with placeholder values.

### Database (PostgreSQL)

- [x] Compose (or local) Postgres service runs with a named volume for data.
- [x] `DATABASE_URL` (or equivalent) documented and wired into the API.
- [ ] `feedback_submissions` table (or chosen name) matches the planned columns; rows persist across API restarts.

### Backend (FastAPI)

- [x] App boots with uvicorn; health or root check route for sanity.
- [ ] `POST /api/feedback` accepts JSON body `{ email, comment, rating, highlight }`.
- [ ] `201` response on success with useful body (e.g. `id`).
- [ ] ORM/session layer inserts a row and commits; errors handled without leaking stack traces to clients in production-like mode.
- [x] Static files: Vite `dist/` mounted/served after build; API routes registered before static + SPA fallback if needed.

### Backend validation and errors

- [ ] All four fields required on the API; missing or empty fields yield clear errors (e.g. `422` with readable messages).
- [ ] Email validated server-side (e.g. Pydantic `EmailStr` or equivalent).
- [ ] `rating` constrained to integers 1–5.
- [ ] `highlight` restricted to exactly: Food, Coffee, Service, Atmosphere.

### Frontend (React + TypeScript + Vite)

- [x] Vite React TS project builds without errors (`npm run build`).
- [ ] Form includes all four fields: email, comment, rating (1–5), highlight (single choice of four).
- [ ] Form submits to the API (relative `/api/...` when same-origin, or configured base URL in dev).
- [ ] Email required; **regex** validation on the client before submit (per brief).
- [ ] Other fields required with sensible client-side checks (trim, range, enum).
- [ ] Submit blocked or errors shown when validation fails; user can correct without losing context.

### Frontend UX and robustness

- [ ] Loading/disabled state on submit; no double-submit while request in flight.
- [ ] Success feedback after a saved submission (message or inline confirmation).
- [ ] API validation errors (`422`) surfaced in plain language (map `detail` to UI).
- [ ] Basic accessibility: labels associated with inputs, keyboard usable, focus not trapped.

### Docker and one-command run

- [x] Multi-stage (or documented) build: frontend `dist/` ends up inside or next to the API image as planned.
- [x] `compose.yaml` (or equivalent) defines **app** + **postgres**; app depends on DB healthy/ready where appropriate.
- [ ] `docker compose up --build` (or `make start`) brings up the full stack; browser can open the app and post feedback.

### Makefile (optional but planned)

- [x] Root `Makefile` with `start` / `stop` (and aliases) wrapping `docker compose`.
- [x] `make help` documents targets; `COMPOSE_PROJECT_NAME` or Compose `name:` set for stable names.

### Documentation

- [x] `README.md`: prerequisites (Docker, Node, Python versions as needed), clone, env copy, **how to start** (Make + raw compose), **how to stop**, default URLs.
- [x] Dev workflow documented: same-origin full stack vs Vite dev server + API (including CORS/proxy if used).
- [x] This `PLANNING.md` updated if major decisions changed during build.

### Tests (minimal, purposeful)

- [ ] At least one API test: happy path creates a row (or returns 201).
- [ ] At least one API test: missing/invalid field returns expected status and structured error.
- [ ] Optional: small unit test for email regex or shared validation helper (only if it earns its keep).

### Submission and review signals

- [ ] Public GitHub repo contains everything to run and understand the app.
- [ ] Commit history tells a coherent story (scaffold, feature slices, fixes), not a single monolithic commit.
- [ ] Short **AI / process note** (`NOTES.md` or README section): tools used, prompts worth keeping, what was manually verified or refactored.

## What reviewers asked to see (brief)

- Meaningful **commit history** (logical steps, not one giant dump).
- **Documentation / planning** — this file plus README.
- **Validation and error handling** — explicit in code and briefly in README.
- **Tests** — few, purposeful, with a sentence on why each exists.
- **AI tooling** — short `NOTES.md` or README section: prompts used, what was verified manually, what was refactored after generation.

## Risks and simplifications

- **Time box**: Skip admin UI, auth, and analytics unless scope expands.
- **Migrations**: Start simple; add Alembic if we need iterative schema changes with clean history.

## Open decisions (resolve during build)

- ~~Exact folder names (`frontend` / `backend` vs `client` / `api`).~~ Resolved: `frontend/`, `backend/`.
- Dev workflow: Vite proxy vs explicit `VITE_API_URL` when UI and API run on different ports.
- ORM choice (SQLAlchemy 2.0 is the default pairing with FastAPI in many tutorials).

---

*Last updated: Docker multi-stage image, Compose app + Postgres, Makefile, VERSION 0.1.0.*
