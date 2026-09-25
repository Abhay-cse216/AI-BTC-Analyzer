"""
Application configuration.

All values are loaded from environment variables (see .env.example).
Nothing here is hard-coded Bitcoin data -- this file only controls
how the backend connects to its dependencies (database, external API, CORS).
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- App ---
    APP_NAME: str = "AI-BTC Analyzer"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # --- CORS ---
    # Comma-separated origins in .env, e.g. "http://localhost:3000,http://127.0.0.1:3000"
    CORS_ORIGINS: str = "http://localhost:3000"

    # --- Mempool.space API ---
    MEMPOOL_API_BASE_URL: str = "https://mempool.space/api"
    MEMPOOL_WS_URL: str = "wss://mempool.space/api/v1/ws"
    MEMPOOL_REQUEST_TIMEOUT_SECONDS: float = 30.0

    # --- Database ---
    # Example: postgresql+psycopg2://postgres:password@localhost:5432/ai_btc_analyzer
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/ai_btc_analyzer"

    # --- Caching ---
    # How long (seconds) cached Mempool.space responses are considered fresh.
    CACHE_TTL_SECONDS: int = 30

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance so we don't re-parse env vars on every call."""
    return Settings()
