from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get(f"{settings.api_v1_prefix}/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """Confirm that the API process is responding; this does not check database health."""
    return {"status": "ok", "service": "queuecare-api"}
