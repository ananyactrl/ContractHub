from datetime import datetime
import os
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from .database import Base


EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", "8"))


class User(Base):
	__tablename__ = "users"

	user_id = Column(Integer, primary_key=True, index=True)
	username = Column(String(255), unique=True, index=True, nullable=False)
	password_hash = Column(String(255), nullable=False)

	documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
	chunks = relationship("Chunk", back_populates="user", cascade="all, delete-orphan")


class Document(Base):
	__tablename__ = "documents"

	doc_id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
	filename = Column(String(512), nullable=False)
	uploaded_on = Column(DateTime, default=datetime.utcnow, nullable=False)
	expiry_date = Column(DateTime, nullable=True)
	status = Column(String(32), default="Active", nullable=False)
	risk_score = Column(String(16), default="Low", nullable=False)

	user = relationship("User", back_populates="documents")
	chunks = relationship("Chunk", back_populates="document", cascade="all, delete-orphan")


class Chunk(Base):
	__tablename__ = "chunks"

	chunk_id = Column(String(64), primary_key=True, index=True)
	doc_id = Column(Integer, ForeignKey("documents.doc_id", ondelete="CASCADE"), nullable=False, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
	text_chunk = Column(Text, nullable=False)
	embedding = Column(Vector(EMBEDDING_DIM), nullable=False)
	meta = Column(JSONB, nullable=True)

	user = relationship("User", back_populates="chunks")
	document = relationship("Document", back_populates="chunks")
