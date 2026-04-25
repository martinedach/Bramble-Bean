# Build and verification notes

## AI tooling used

- Cursor coding agent for implementation, refactors, and repo hygiene.
- Docker/Compose and `gh` CLI executed from the local terminal for build and release workflows.

## Prompts and guidance that were kept

- Keep implementation in small, reviewable commits.
- Keep commit messages clean and focused on changes, not prompt details.
- Track progress and decisions in `PLANNING.md` and keep docs current with code.

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
