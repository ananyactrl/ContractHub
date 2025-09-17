import os
import hashlib
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .db import connection
from .auth import create_token, parse_token


app = FastAPI(title="ContractHub Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignupLoginRequest(BaseModel):
    username: str
    password: str


class UploadRequest(BaseModel):
    filename: str
    contentType: Optional[str] = None


class AskRequest(BaseModel):
    q: str


async def get_user_id_from_auth(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    return parse_token(token)


@app.post("/signup")
def signup(req: SignupLoginRequest, conn=Depends(connection)):
    pw_hash = hashlib.sha256(req.password.encode()).hexdigest()
    try:
        with conn.cursor() as cur:
            cur.execute("insert into users(username, password_hash) values(%s,%s) returning user_id", (req.username, pw_hash))
            row = cur.fetchone()
    except Exception:
        raise HTTPException(status_code=400, detail="Username already exists")
    user_id = str(row[0])
    token = create_token(user_id)
    return {"token": token, "user_id": user_id}


@app.post("/login")
def login(req: SignupLoginRequest, conn=Depends(connection)):
    pw_hash = hashlib.sha256(req.password.encode()).hexdigest()
    with conn.cursor() as cur:
        cur.execute("select user_id from users where username=%s and password_hash=%s", (req.username, pw_hash))
        row = cur.fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id = str(row[0])
    token = create_token(user_id)
    return {"token": token, "user_id": user_id}


def mock_embed(text: str) -> list[float]:
    # Simple deterministic mock embedding
    h = hashlib.sha256(text.encode()).digest()
    vals = [int.from_bytes(h[i:i+4], 'big', signed=False) % 1000 / 1000 for i in range(0, 32, 4)]
    return vals


@app.post("/upload")
def upload(req: UploadRequest, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    # Simulate LlamaCloud parse with two chunks
    chunks = [
        {
            "chunk_id": None,
            "text": "Termination clause: Either party may terminate with 90 days’ notice.",
            "metadata": {"page": 2, "contract_name": req.filename},
        },
        {
            "chunk_id": None,
            "text": "Liability cap: Limited to 12 months’ fees.",
            "metadata": {"page": 5, "contract_name": req.filename},
        },
    ]

    with conn.cursor() as cur:
        cur.execute("insert into documents(user_id, filename, status, risk_score) values(%s,%s,%s,%s) returning doc_id", (user_id, req.filename, 'Active', 'Medium'))
        row = cur.fetchone()
        doc_id = str(row[0]) if row else None
        for ch in chunks:
            emb = mock_embed(ch["text"])  # vector(8) demo
            cur.execute("insert into chunks(doc_id, user_id, text_chunk, embedding, metadata) values(%s,%s,%s,%s,%s)", (doc_id, user_id, ch["text"], emb, ch["metadata"]))
        conn.commit()
    return {"doc_id": doc_id, "status": "processed"}


@app.get("/contracts")
def list_contracts(user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    with conn.cursor() as cur:
        cur.execute("select doc_id, filename, uploaded_on, status, risk_score from documents where user_id=%s order by uploaded_on desc", (user_id,))
        rows = cur.fetchall()
    return [
        {
            "id": str(r[0]),
            "name": r[1],
            "parties": "Unknown",
            "expiry": None,
            "status": r[3],
            "risk": r[4],
            "uploaded_on": r[2].isoformat() if r[2] else None,
        } for r in rows
    ]


@app.get("/contracts/{doc_id}")
def get_contract(doc_id: str, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    with conn.cursor() as cur:
        cur.execute("select doc_id, filename, uploaded_on, status, risk_score from documents where user_id=%s and doc_id=%s", (user_id, doc_id))
        doc = cur.fetchone()
    if doc is None:
        raise HTTPException(status_code=404, detail="Not found")
    with conn.cursor() as cur:
        cur.execute("select text_chunk, metadata from chunks where user_id=%s and doc_id=%s limit 10", (user_id, doc_id))
        chunks = cur.fetchall()
    # Mock clauses/insights
    clauses = [
        {"title": "Termination", "summary": "90 days notice period.", "confidence": 0.82},
        {"title": "Liability Cap", "summary": "12 months’ fees limit.", "confidence": 0.87},
    ]
    insights = [
        {"risk": "High", "message": "Liability cap excludes data breach costs."},
        {"risk": "Medium", "message": "Renewal auto-renews unless cancelled 60 days before expiry."},
    ]
    evidence = [
        {"source": str(c[1].get("page", "?")), "snippet": c[0], "relevance": 0.9}
        for c in chunks[:3]
    ]
    return {
        "id": str(doc[0]),
        "name": doc[1],
        "parties": "Unknown",
        "start": None,
        "expiry": None,
        "status": doc[3],
        "risk": doc[4],
        "clauses": clauses,
        "insights": insights,
        "evidence": evidence,
    }


@app.post("/ask")
def ask(req: AskRequest, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    q_emb = mock_embed(req.q)
    with conn.cursor() as cur:
        cur.execute(
            "select text_chunk, metadata, (embedding <-> %s::vector) as distance from chunks where user_id=%s order by distance asc limit 5",
            (q_emb, user_id)
        )
        rows = cur.fetchall()
    chunks = [
        {"text": r[0], "metadata": r[1], "relevance": max(0.0, 1.0 - float(r[2]))}
        for r in rows
    ]
    answer = "This is a mock answer based on your documents."
    return {"answer": answer, "chunks": chunks}


