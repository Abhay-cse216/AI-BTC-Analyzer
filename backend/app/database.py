"""
SQLAlchemy engine / session setup.

This is created in Phase 1 so the app structure is complete, but tables
and real persistence are wired up in PHASE 5. The health-check endpoint
in Phase 2 does NOT require the database to be reachable.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import get_settings

settings = get_settings()

# pool_pre_ping avoids using stale/dead connections after DB restarts.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
