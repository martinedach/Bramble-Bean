import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal: sessionmaker[Session] | None = None


def normalize_database_url(url: str) -> str:
    if url.startswith("postgresql://") and not url.startswith("postgresql+psycopg"):
        return "postgresql+psycopg://" + url.removeprefix("postgresql://")
    return url


def configure_database(url: str | None) -> None:
    global engine, SessionLocal
    if not url:
        raise RuntimeError("DATABASE_URL is required to run the API with persistence")
    normalized = normalize_database_url(url)
    if normalized.startswith("sqlite"):
        engine = create_engine(
            normalized,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(normalized, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise RuntimeError("Database not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
