# AI-BTC Analyzer

**AI-Powered Monitoring & Analysis of Bitcoin Transaction Traffic**

> This README will be expanded into the full project document in a later
> phase (architecture, AI/ML methodology, risk scoring, deployment, SIH
> demo script, etc). For now it just covers what's built so far: the
> project skeleton and the FastAPI backend health check.

## Status

- [x] Phase 1 — Project structure
- [x] Phase 2 — FastAPI backend skeleton + health check
- [ ] Phase 3 — Mempool.space integration
- [ ] Phase 4+ — see project plan

## Quick start (backend only, so far)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
copy .env.example .env       # Windows (use `cp` on macOS/Linux)
uvicorn app.main:app --reload
```

Then open http://127.0.0.1:8000/docs to see the interactive API docs,
or http://127.0.0.1:8000/api/health to check the backend is alive.
