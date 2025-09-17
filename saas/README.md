# Contracts RAG SaaS Prototype

Frontend: React + Tailwind (Vite)
Backend: FastAPI (Python)
Database: Postgres + pgvector

## Features
- JWT auth (signup/login), multi-tenant scoping by `user_id`
- Upload PDF/TXT/DOCX (mock parse -> chunks+embeddings stored)
- Contracts dashboard with filters, search, pagination
- Contract detail with clauses, AI insights, evidence drawer
- Query interface using pgvector similarity (mock embed)

## Repo Structure
- `backend/` — FastAPI app
- `frontend/` — React app
- `db/schema.sql` — DDL for tables and indexes
- `docker-compose.yml` — Postgres with pgvector
- `docs/er-diagram.svg` — ER diagram image

## Setup (Local)
1) Start Postgres with pgvector
```bash
docker compose up -d
```
2) Create DB schema
```bash
psql postgresql://postgres:postgres@localhost:5432/contracts_db -f db/schema.sql
```
3) Backend
```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate  # Windows PowerShell
pip install -r requirements.txt
set DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/contracts_db
set SECRET_KEY=dev
uvicorn app.main:app --reload --port 8000
```
4) Frontend
```bash
cd frontend
npm i
npm run dev
```
Open http://localhost:5173

## API Routes
- POST `/signup` { username, password }
- POST `/login` (form-encoded) -> access_token
- POST `/upload` (multipart): file, expiry_date, status, risk_score
- GET `/contracts`
- GET `/contracts/:id`
- POST `/ask` { question, doc_id? }

All routes except `/signup` and `/login` require `Authorization: Bearer <token>`.

## Deployment
- Backend: Render (see `backend/render.yaml`). Set `DATABASE_URL` to Supabase or managed Postgres with pgvector.
- Frontend: Netlify. Set `VITE_API_BASE` to backend URL.
- Database: Supabase or your own Postgres with pgvector. Run `db/schema.sql`.

## ER Diagram
See `docs/er-diagram.svg` and `docs/er-diagram.md`.

## Mock LlamaCloud
Parsing is simulated with a static response, with embeddings stored in `chunks.embedding` (VECTOR(4)).
