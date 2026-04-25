# Build and verification notes

## AI tooling used

- Cursor coding agent for implementation, refactors, and repo hygiene.
- Docker/Compose and `gh` CLI executed from the local terminal for build and release workflows.

## Prompts and guidance that were kept

- Keep implementation in small, reviewable commits.
- Keep commit messages clean and focused on changes, not prompt details.
- Track progress and decisions in `PLANNING.md` and keep docs current with code.

### Polished prompt examples used during this build

- **Planning and scope**
  - "Let's create a planning document for a cafe feedback app using React + TypeScript + Vite, FastAPI, and Postgres."
  - "Add a checklist I can tick off as we build each layer."

- **Delivery model**
  - "Serve the frontend build from FastAPI in one container for simplicity."
  - "Document Make targets before creating implementation details."

- **Infrastructure**
  - "Start with infra first: write the Docker Compose file and Dockerfile."
  - "Add Make commands for start/stop/build/logs and keep docs aligned."

- **Frontend and UX**
  - "Improve the page layout and make the design feel less basic."
  - "Use the header logo as the favicon and set the tab title to the cafe name."
  - "Make sure the form card is visible without unnecessary scrolling."
  - "Add required markers on labels so required fields are obvious."

- **Backend robustness**
  - "Explore backend tests in detail and add missing validation coverage."
  - "Protect against duplicate submissions and handle DB commit failures cleanly."
  - "Add a GET endpoint and an admin UI to view submitted reviews."

- **Quality and operations**
  - "Run frontend and backend checks during image build so bad builds fail early."
  - "Adjust test execution so test data does not pollute real Postgres data."

- **Documentation and release**
  - "Update planning as decisions change and keep README clean."
  - "Create release tags and publish release notes when version increments."
  - "Add a future roadmap doc for admin auth and LLM sentiment analysis."

## Manual verification performed

- Ran the app with `docker compose up --build` and loaded `http://localhost:8000`.
- Submitted feedback form end-to-end against `POST /api/feedback`.
- Checked API health route at `GET /api/health`.
- Ran frontend checks (`npm run lint`, `npm run build`).
- Ran backend tests (`pytest`), including via `make test`.

## Refactors and hardening after initial generation

- Added compact, accessible form layout improvements and clearer required-field markers.
- Replaced one-off Compose test containers with `make test` using `docker compose exec` for repeatable runs.
- Added build-time quality gates in `Dockerfile` (frontend lint/build and backend tests).
- Expanded backend API tests for rating bounds/type, email validation, and whitespace-only comments.
