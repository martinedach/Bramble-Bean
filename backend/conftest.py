"""
Pytest defaults DATABASE_URL only when unset.

The app and Docker Compose use PostgreSQL. Tests default to an in-memory
SQLite URL so pytest does not require Postgres running; SQLAlchemy uses the
same models and the same API code paths. For integration tests against a real
database, export DATABASE_URL before running pytest, e.g.:

  DATABASE_URL=postgresql+psycopg://cafe:cafe@127.0.0.1:5432/cafe pytest tests/
"""

import os

if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
