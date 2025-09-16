# ContractHub Backend (FastAPI)

## Local Run

```
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://postgres:*****@db.iftmelhmlsngxdcuryuu.supabase.co:5432/postgres
export JWT_SECRET=change-me
export CORS_ORIGIN=*
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## SQL (run in Supabase)

```
create extension if not exists vector;

create table if not exists users (
  user_id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists documents (
  doc_id uuid primary key default gen_random_uuid(),
  user_id uuid references users(user_id) on delete cascade,
  filename text not null,
  uploaded_on timestamptz default now(),
  expiry_date date,
  status text check (status in ('Active','Renewal Due','Expired')),
  risk_score text check (risk_score in ('Low','Medium','High')),
  metadata jsonb default '{}'
);

create table if not exists chunks (
  chunk_id uuid primary key default gen_random_uuid(),
  doc_id uuid references documents(doc_id) on delete cascade,
  user_id uuid references users(user_id) on delete cascade,
  text_chunk text not null,
  embedding vector(8) not null,
  metadata jsonb default '{}'
);

create index if not exists idx_chunks_user on chunks(user_id);
create index if not exists idx_docs_user on documents(user_id);
create index if not exists idx_chunks_doc on chunks(doc_id);
```

## Deploy (Render)
- Web Service → FastAPI
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Env Vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`


