import os
from contextlib import contextmanager
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/contracts_db")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db() -> None:
	# Ensure pgvector extension exists and create tables
	with engine.begin() as conn:
		conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
		Base.metadata.create_all(bind=conn)


@contextmanager
def get_db_session():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()
