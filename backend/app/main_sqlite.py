import os
import hashlib
import uuid
import json
import math
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .db_sqlite import connection, init_sqlite_db
from .auth import create_token, parse_token

# Initialize database on startup
init_sqlite_db()

app = FastAPI(title="ContractHub Backend - SQLite")

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
        cur = conn.cursor()
        cur.execute("INSERT INTO users(username, password_hash) VALUES(?, ?)", (req.username, pw_hash))
        user_id = str(cur.lastrowid)
        conn.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Username already exists")
    token = create_token(user_id)
    return {"token": token, "user_id": user_id}

@app.post("/login")
def login(req: SignupLoginRequest, conn=Depends(connection)):
    pw_hash = hashlib.sha256(req.password.encode()).hexdigest()
    cur = conn.cursor()
    cur.execute("SELECT user_id FROM users WHERE username=? AND password_hash=?", (req.username, pw_hash))
    row = cur.fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id = str(row[0])
    token = create_token(user_id)
    return {"token": token, "user_id": user_id}

def mock_embed(text: str) -> list[float]:
    """Simple deterministic mock embedding."""
    h = hashlib.sha256(text.encode()).digest()
    vals = [int.from_bytes(h[i:i+4], 'big', signed=False) % 1000 / 1000 for i in range(0, 32, 4)]
    return vals

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    dot_product = sum(x * y for x, y in zip(a, b))
    magnitude_a = math.sqrt(sum(x * x for x in a))
    magnitude_b = math.sqrt(sum(x * x for x in b))
    if magnitude_a == 0 or magnitude_b == 0:
        return 0
    return dot_product / (magnitude_a * magnitude_b)

@app.post("/upload")
def upload(req: UploadRequest, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    # Mock LlamaCloud parse with two chunks
    chunks = [
        {
            "text": "Termination clause: Either party may terminate with 90 days' notice.",
            "metadata": {"page": 2, "contract_name": req.filename},
        },
        {
            "text": "Liability cap: Limited to 12 months' fees.",
            "metadata": {"page": 5, "contract_name": req.filename},
        },
    ]

    cur = conn.cursor()
    cur.execute("INSERT INTO documents(user_id, filename, status, risk_score) VALUES(?, ?, ?, ?)", 
                (user_id, req.filename, 'Active', 'Medium'))
    doc_id = str(cur.lastrowid)
    
    for ch in chunks:
        chunk_id = str(uuid.uuid4())
        emb = mock_embed(ch["text"])
        cur.execute("INSERT INTO chunks(chunk_id, doc_id, user_id, text_chunk, embedding, metadata) VALUES(?, ?, ?, ?, ?, ?)", 
                    (chunk_id, doc_id, user_id, ch["text"], json.dumps(emb), json.dumps(ch["metadata"])))
    
    conn.commit()
    return {"doc_id": doc_id, "status": "processed"}

@app.get("/contracts")
def list_contracts(user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    cur = conn.cursor()
    cur.execute("SELECT doc_id, filename, uploaded_on, expiry_date, status, risk_score FROM documents WHERE user_id=? ORDER BY uploaded_on DESC", (user_id,))
    rows = cur.fetchall()
    
    return [
        {
            "id": str(r[0]),
            "name": r[1],
            "parties": "Acme Corp & TechFlow Inc",  # Mock parties
            "expiry": "2025-12-31",  # Mock expiry
            "status": r[4],
            "risk": r[5],
            "uploaded_on": r[2] if r[2] else datetime.now().isoformat(),
        } for r in rows
    ]

@app.get("/contracts/{doc_id}")
def get_contract(doc_id: str, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    cur = conn.cursor()
    cur.execute("SELECT doc_id, filename, uploaded_on, expiry_date, status, risk_score FROM documents WHERE user_id=? AND doc_id=?", (user_id, doc_id))
    doc = cur.fetchone()
    
    if doc is None:
        raise HTTPException(status_code=404, detail="Not found")
    
    cur.execute("SELECT text_chunk, metadata FROM chunks WHERE user_id=? AND doc_id=? LIMIT 10", (user_id, doc_id))
    chunks = cur.fetchall()
    
    # Mock clauses/insights
    clauses = [
        {"title": "Termination", "summary": "90 days notice period.", "confidence": 0.82},
        {"title": "Liability Cap", "summary": "12 months' fees limit.", "confidence": 0.87},
    ]
    insights = [
        {"risk": "High", "message": "Liability cap excludes data breach costs."},
        {"risk": "Medium", "message": "Renewal auto-renews unless cancelled 60 days before expiry."},
    ]
    evidence = [
        {"source": str(json.loads(c[1]).get("page", "?")), "snippet": c[0], "relevance": 0.9}
        for c in chunks[:3]
    ]
    
    return {
        "id": str(doc[0]),
        "name": doc[1],
        "parties": "Acme Corp & TechFlow Inc",
        "start": "2024-01-01",  # Mock start date
        "expiry": "2025-12-31",  # Mock expiry
        "status": doc[4],
        "risk": doc[5],
        "clauses": clauses,
        "insights": insights,
        "evidence": evidence,
    }

@app.post("/ask")
def ask(req: AskRequest, user_id: str = Depends(get_user_id_from_auth), conn=Depends(connection)):
    q_emb = mock_embed(req.q)
    cur = conn.cursor()
    cur.execute("SELECT text_chunk, metadata, embedding FROM chunks WHERE user_id=?", (user_id,))
    rows = cur.fetchall()
    
    # Calculate similarity and sort
    results = []
    for r in rows:
        chunk_emb = json.loads(r[2])
        similarity = cosine_similarity(q_emb, chunk_emb)
        distance = 1.0 - similarity
        results.append((r[0], r[1], distance))
    
    # Sort by distance (ascending) and take top 5
    results.sort(key=lambda x: x[2])
    top_results = results[:5]
    
    chunks = [
        {"text": r[0], "metadata": json.loads(r[1]), "relevance": max(0.0, 1.0 - r[2])}
        for r in top_results
    ]
    
    answer = "This is a mock answer based on your documents."
    return {"answer": answer, "chunks": chunks}

@app.get("/")
def read_root():
    return {"message": "ContractHub API is running with SQLite backend"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "sqlite"}
