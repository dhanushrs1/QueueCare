from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Confirm that the API process is responding; this does not check database health."""
    return {"status": "ok", "service": "queuecare-api"}
