from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
	username: str
	password: str


class Token(BaseModel):
	access_token: str
	token_type: str = "bearer"


class DocumentBase(BaseModel):
	filename: str
	uploaded_on: datetime
	expiry_date: Optional[datetime] = None
	status: str
	risk_score: str


class Document(DocumentBase):
	doc_id: int

	class Config:
		from_attributes = True


class Chunk(BaseModel):
	chunk_id: str
	text_chunk: str
	metadata: dict
	relevance: Optional[float] = None
	confidence: Optional[float] = None

	class Config:
		from_attributes = True


class AskRequest(BaseModel):
	question: str
	doc_id: Optional[int] = None


class AskResponse(BaseModel):
	answer: str
	retrieved_chunks: List[Chunk]
