"""
Health-check endpoints.

Used to verify the backend is running and, separately, whether it can
currently reach Mempool.space. This endpoint never fabricates data --
if Mempool.space is unreachable it reports that honestly.
"""

from datetime import datetime, timezone
from urllib.request import Request, urlopen

from fastapi import APIRouter

from app.config import get_settings

router = APIRouter(prefix="/api", tags=["health"])

settings = get_settings()


@router.get("/health")
async def health_check():
    """Basic liveness check for the FastAPI service itself."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/health/mempool")
async def mempool_connectivity_check():
    """
    Checks whether Mempool.space is actually reachable right now.

    This performs a REAL network call -- it does not assume connectivity.
    """
    url = f"{settings.MEMPOOL_API_BASE_URL}/blocks/tip/height"

    try:
        request = Request(
            url,
            headers={
                "User-Agent": "AI-BTC-Analyzer/1.0",
                "Accept": "application/json",
            },
        )

        with urlopen(
            request,
            timeout=settings.MEMPOOL_REQUEST_TIMEOUT_SECONDS,
        ) as response:
            tip_height = int(response.read().decode().strip())

        return {
            "mempool_reachable": True,
            "tip_block_height": tip_height,
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }

    except Exception as exc:
        return {
            "mempool_reachable": False,
            "error": str(exc),
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }