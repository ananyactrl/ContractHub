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
async def signup(req: SignupLoginRequest, conn=Depends(connection)):
    pw_hash = hashlib.sha256(req.password.encode()).hexdigest()
    try:
        row = await conn.fetchrow(
            "insert into users(username, password_hash) values($1,$2) returning user_id",
            req.username, pw_hash
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Username already exists")
    token = create_token(str(row["user_id"]))
    return {"token": token, "user_id": str(row["user_id"])}


@app.post("/login")
async def login(req: SignupLoginRequest, conn=Depends(connection)):
    pw_hash = hashlib.sha256(req.password.encode()).hexdigest()
    row = await conn.fetchrow(
        "select user_id from users where username=$1 and password_hash=$2",
        req.username, pw_hash
    )
    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(str(row["user_id"]))
    return {"token": token, "user_id": str(row["user_id"])}


def mock_embed(text: str) -> list[float]:
    # Simple deterministic mock embedding
    h = hashlib.sha256(text.encode()).digest()
    vals = [int.from_bytes(h[i:i+4], 'big', signed=False) % 1000 / 1000 for i in range(0, 32, 4)]
    return vals


@app.post("/upload")
async def upload(req: UploadRequest, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
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

    doc = await conn.fetchrow(
        "insert into documents(user_id, filename, status, risk_score) values($1,$2,$3,$4) returning doc_id",
        user_id, req.filename, 'Active', 'Medium'
    )
    doc_id = str(doc["doc_id"]) if doc else None

    for ch in chunks:
        emb = mock_embed(ch["text"])  # vector(8) ok for demo
        await conn.execute(
            "insert into chunks(doc_id, user_id, text_chunk, embedding, metadata) values($1,$2,$3,$4,$5)",
            doc_id, user_id, ch["text"], emb, ch["metadata"]
        )
    return {"doc_id": doc_id, "status": "processed"}


@app.get("/contracts")
async def list_contracts(user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    rows = await conn.fetch(
        "select doc_id, filename, uploaded_on, status, risk_score from documents where user_id=$1 order by uploaded_on desc",
        user_id
    )
    return [
        {
            "id": str(r["doc_id"]),
            "name": r["filename"],
            "parties": "Unknown",
            "expiry": None,
            "status": r["status"],
            "risk": r["risk_score"],
            "uploaded_on": r["uploaded_on"].isoformat() if r["uploaded_on"] else None,
        } for r in rows
    ]


@app.get("/contracts/{doc_id}")
async def get_contract(doc_id: str, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    doc = await conn.fetchrow(
        "select doc_id, filename, uploaded_on, status, risk_score from documents where user_id=$1 and doc_id=$2",
        user_id, doc_id
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    chunks = await conn.fetch("select text_chunk, metadata from chunks where user_id=$1 and doc_id=$2 limit 10", user_id, doc_id)
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
        {"source": str(c["metadata"].get("page", "?")), "snippet": c["text_chunk"], "relevance": 0.9}
        for c in chunks[:3]
    ]
    return {
        "id": str(doc["doc_id"]),
        "name": doc["filename"],
        "parties": "Unknown",
        "start": None,
        "expiry": None,
        "status": doc["status"],
        "risk": doc["risk_score"],
        "clauses": clauses,
        "insights": insights,
        "evidence": evidence,
    }


@app.post("/ask")
async def ask(req: AskRequest, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    q_emb = mock_embed(req.q)
    # pgvector similarity: use <-> operator. Our embedding is small, stored as vector(8)
    rows = await conn.fetch(
        "select text_chunk, metadata, embedding <-> $1::vector as distance from chunks where user_id=$2 order by distance asc limit 5",
        q_emb, user_id
    )
    chunks = [
        {"text": r["text_chunk"], "metadata": r["metadata"], "relevance": max(0.0, 1.0 - float(r["distance"]))}
        for r in rows
    ]
    answer = "This is a mock answer based on your documents."
    return {"answer": answer, "chunks": chunks}


