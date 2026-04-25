import logging
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(title="cafe-review")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _configure_static() -> None:
    static_dir = Path(__file__).resolve().parent / "static"
    if not static_dir.is_dir():
        log.warning(
            "static directory missing; SPA not served (build frontend into backend/static or use Docker)"
        )
        return
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")


_configure_static()

if os.getenv("DATABASE_URL"):
    log.info("DATABASE_URL is set")
else:
    log.warning("DATABASE_URL is not set")
