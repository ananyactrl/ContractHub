import os
import sqlite3
from typing import Generator
from contextlib import contextmanager

DATABASE_FILE = os.getenv("DATABASE_FILE", "contracthub.db")

def init_sqlite_db():
    """Initialize SQLite database with required schema."""
    conn = sqlite3.connect(DATABASE_FILE)
    cur = conn.cursor()
    
    # Create tables
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            doc_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expiry_date TIMESTAMP NULL,
            status TEXT DEFAULT 'Active',
            risk_score TEXT DEFAULT 'Low',
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chunks (
            chunk_id TEXT PRIMARY KEY,
            doc_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            text_chunk TEXT NOT NULL,
            embedding TEXT NOT NULL,
            metadata TEXT,
            FOREIGN KEY (doc_id) REFERENCES documents(doc_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)
    
    # Create indexes
    cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_user ON chunks(user_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(doc_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id)")
    
    conn.commit()
    conn.close()

@contextmanager
def get_sqlite_connection():
    """Get SQLite connection context manager."""
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row  # Enable dict-like access
    try:
        yield conn
    finally:
        conn.close()

def connection() -> Generator[sqlite3.Connection, None, None]:
    """Database connection generator for dependency injection."""
    with get_sqlite_connection() as conn:
        yield conn
