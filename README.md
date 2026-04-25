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

Planning and documentation only. Application code, Docker files, and run instructions will land in follow-up commits.

## Running the app

Instructions will be added once the backend, frontend, and Compose setup exist. Until then, see **PLANNING.md** for the intended local and Docker workflows.

## Documentation

- [PLANNING.md](./PLANNING.md) — stack rationale, API and data model drafts, Makefile plan, and tickable delivery checklist.
