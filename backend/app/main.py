"""
AI-BTC Analyzer -- FastAPI application entrypoint.

PHASE 2 scope: app factory, CORS, and the health-check router only.
Bitcoin data routes are added in PHASE 3.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health 
from app.config import get_settings
from app.api.bitcoin import router as bitcoin_router


settings = get_settings()



app = FastAPI(
    title="AI-BTC Analyzer",
    description="AI-Powered Monitoring & Analysis of Bitcoin Transaction Traffic",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ai-btc-analyzer-kappa.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(bitcoin_router)


@app.get("/")
async def root():
    return {
        "message": f"{settings.APP_NAME} backend is running.",
        "docs": "/docs",
    }
