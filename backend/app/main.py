import os
from datetime import datetime
from typing import List, Optional

import numpy as np
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select, func, text

from .database import init_db
from .models import User, Document, Chunk, EMBEDDING_DIM
from .schemas import UserCreate, Token, Document as DocumentSchema, AskRequest, AskResponse, Chunk as ChunkSchema
from .auth import get_password_hash, verify_password, create_access_token
from .deps import get_db, get_current_user

app = FastAPI(title="Contracts RAG API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
	init_db()


@app.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
	if db.query(User).filter(User.username == user_in.username).first():
		raise HTTPException(status_code=400, detail="Username already registered")
	user = User(username=user_in.username, password_hash=get_password_hash(user_in.password))
	db.add(user)
	db.commit()
	db.refresh(user)
	token = create_access_token(subject=user.username)
	return Token(access_token=token)


@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = create_access_token(subject=user.username)
    return Token(access_token=token)


class LoginJSON(BaseModel):
    username: str
    password: str


@app.post("/login_json", response_model=Token)
def login_json(payload: LoginJSON, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = create_access_token(subject=user.username)
    return Token(access_token=token)


MOCK_PARSE = {
	"document_id": "doc123",
	"chunks": [
		{
			"chunk_id": "c1",
			"text": "Termination clause: Either party may terminate with 90 days’ notice.",
			"embedding": [0.12, -0.45, 0.91, 0.33],
			"metadata": {"page": 2, "contract_name": "MSA.pdf"},
		},
		{
			"chunk_id": "c2",
			"text": "Liability cap: Limited to 12 months’ fees.",
			"embedding": [0.01, 0.22, -0.87, 0.44],
			"metadata": {"page": 5, "contract_name": "MSA.pdf"},
		},
	],
}


def embed_query_mock(question: str) -> List[float]:
	# Simple deterministic mock embedding from text
	rng = np.random.default_rng(abs(hash(question)) % (2**32))
	vec = rng.normal(size=EMBEDDING_DIM)
	return (vec / (np.linalg.norm(vec) + 1e-8)).tolist()


@app.post("/upload")
def upload_contract(
	file: UploadFile = File(...),
	expiry_date: Optional[str] = Form(None),
	status: Optional[str] = Form("Active"),
	risk_score: Optional[str] = Form("Low"),
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	if file.content_type not in ("application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"):
		raise HTTPException(status_code=400, detail="Unsupported file type")

	# Simulate parsing using provided mock
	parsed = MOCK_PARSE

	doc = Document(
		user_id=current_user.user_id,
		filename=file.filename,
		uploaded_on=datetime.utcnow(),
		expiry_date=datetime.fromisoformat(expiry_date) if expiry_date else None,
		status=status or "Active",
		risk_score=risk_score or "Low",
	)
	db.add(doc)
	db.commit()
	db.refresh(doc)

	for ch in parsed["chunks"]:
		emb = ch["embedding"]
		if len(emb) != EMBEDDING_DIM:
			# pad or trim to EMBEDDING_DIM
			emb = (emb + [0.0] * EMBEDDING_DIM)[:EMBEDDING_DIM]
		chunk = Chunk(
			chunk_id=f"{doc.doc_id}_{ch['chunk_id']}",
			doc_id=doc.doc_id,
			user_id=current_user.user_id,
			text_chunk=ch["text"],
			embedding=emb,
			metadata={**ch.get("metadata", {}), "filename": file.filename, "uploaded_on": doc.uploaded_on.isoformat()},
		)
		db.add(chunk)

	db.commit()
	return {"doc_id": doc.doc_id, "filename": doc.filename}


@app.get("/contracts", response_model=List[DocumentSchema])
def list_contracts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	rows = db.query(Document).filter(Document.user_id == current_user.user_id).order_by(Document.uploaded_on.desc()).all()
	return rows


@app.get("/contracts/{doc_id}")
def contract_detail(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	doc = db.query(Document).filter(Document.doc_id == doc_id, Document.user_id == current_user.user_id).first()
	if not doc:
		raise HTTPException(status_code=404, detail="Document not found")
	# Mock clauses and insights
	clauses = [
		{"title": "Termination", "text": "Either party may terminate with 90 days’ notice.", "confidence": 0.92},
		{"title": "Liability Cap", "text": "Limited to 12 months’ fees.", "confidence": 0.88},
	]
	insights = [
		{"risk": "Renewal window short", "recommendation": "Negotiate 120 days’ notice."},
		{"risk": "Low liability cap", "recommendation": "Increase to 18 months’ fees."},
	]
	return {
		"document": DocumentSchema.model_validate(doc),
		"clauses": clauses,
		"insights": insights,
	}


@app.post("/ask", response_model=AskResponse)
def ask_question(payload: AskRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	query_vec = embed_query_mock(payload.question)
	# Use pgvector cosine distance: smaller distance is more similar
	# Note: SQLAlchemy pgvector supports operators; we can use raw SQL for clarity
	base_sql = """
		SELECT chunk_id, text_chunk, metadata,
			1 - (embedding <#> :qvec) AS relevance
		FROM chunks
		WHERE user_id = :uid
	"""
	params = {"qvec": query_vec, "uid": current_user.user_id}
	if payload.doc_id is not None:
		base_sql += " AND doc_id = :docid"
		params["docid"] = payload.doc_id
	base_sql += " ORDER BY embedding <#> :qvec ASC LIMIT 5"
	rows = db.execute(text(base_sql), params).mappings().all()

	retrieved = [
		ChunkSchema(
			chunk_id=r["chunk_id"],
			text_chunk=r["text_chunk"],
			metadata=r["metadata"],
			relevance=float(r["relevance"]),
			confidence=round(min(0.99, max(0.5, float(r["relevance"]))), 2),
		)
		for r in rows
	]

	answer = "This is a mock AI answer summarizing key clauses and risks based on retrieved snippets."
	return AskResponse(answer=answer, retrieved_chunks=retrieved)


@app.get("/")
def health():
	return {"status": "ok"}
