import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import feedback

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    import database as db

    url = os.getenv("DATABASE_URL")
    if url:
        db.configure_database(url)
        from models import Base

        Base.metadata.create_all(bind=db.engine)
        log.info("Database tables ensured")
    else:
        log.warning("DATABASE_URL not set; POST /api/feedback will fail until it is configured")
    yield


app = FastAPI(title="cafe-review", lifespan=lifespan)

_cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(feedback.router, prefix="/api")


def _configure_static() -> None:
    static_dir = Path(__file__).resolve().parent / "static"
    if not static_dir.is_dir():
        log.warning(
            "static directory missing; SPA not served (build frontend into backend/static or use Docker)"
        )
        return
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")


_configure_static()
