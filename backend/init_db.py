#!/usr/bin/env python3
"""
Database initialization script for ContractHub SaaS
Initializes the database schema and populates with sample data for demo purposes.
"""

import os
import sys
import psycopg2
import hashlib
from datetime import datetime, timedelta
import random

# Add the parent directory to Python path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_db_connection():
    """Get database connection using DATABASE_URL environment variable."""
    database_url = os.getenv("DATABASE_URL", "postgresql://postgres:shreyasananya@db.iftmelhmlsngxdcuryuu.supabase.co:5432/postgres")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    return psycopg2.connect(database_url)

def init_schema(conn):
    """Initialize database schema."""
    print("Initializing database schema...")
    
    with conn.cursor() as cur:
        # Enable pgvector extension
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        
        # Create tables
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                doc_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                filename VARCHAR(512) NOT NULL,
                uploaded_on TIMESTAMP NOT NULL DEFAULT NOW(),
                expiry_date TIMESTAMP NULL,
                status VARCHAR(32) NOT NULL DEFAULT 'Active',
                risk_score VARCHAR(16) NOT NULL DEFAULT 'Low'
            );
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chunks (
                chunk_id VARCHAR(64) PRIMARY KEY,
                doc_id INTEGER NOT NULL REFERENCES documents(doc_id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                text_chunk TEXT NOT NULL,
                embedding VECTOR(8) NOT NULL,
                metadata JSONB
            );
        """)
        
        # Create indexes
        cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_user ON chunks(user_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(doc_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_vec ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);")
        
    conn.commit()
    print("✅ Database schema initialized successfully")

def mock_embed(text: str) -> list[float]:
    """Generate mock embeddings (same as backend)."""
    h = hashlib.sha256(text.encode()).digest()
    vals = [int.from_bytes(h[i:i+4], 'big', signed=False) % 1000 / 1000 for i in range(0, 32, 4)]
    return vals[:8]  # Take only 8 dimensions

def create_sample_users(conn):
    """Create sample users for demo."""
    print("Creating sample users...")
    
    users = [
        ("demo", "password123"),
        ("admin", "admin123"),
        ("john.doe", "secure123"),
        ("jane.smith", "password456")
    ]
    
    with conn.cursor() as cur:
        for username, password in users:
            pw_hash = hashlib.sha256(password.encode()).hexdigest()
            try:
                cur.execute(
                    "INSERT INTO users(username, password_hash) VALUES(%s, %s) ON CONFLICT (username) DO NOTHING",
                    (username, pw_hash)
                )
            except Exception as e:
                print(f"Warning: Could not create user {username}: {e}")
    
    conn.commit()
    print("✅ Sample users created")

def create_sample_documents(conn):
    """Create sample documents and chunks for demo."""
    print("Creating sample documents and chunks...")
    
    # Sample contracts with realistic content
    contracts = [
        {
            "filename": "Service_Agreement_2024.pdf",
            "status": "Active",
            "risk_score": "Medium",
            "expiry": datetime.now() + timedelta(days=365),
            "chunks": [
                {
                    "text": "This Service Agreement shall commence on January 1, 2024 and shall remain in effect until December 31, 2024, unless terminated earlier in accordance with the terms herein.",
                    "metadata": {"page": 1, "section": "Term"}
                },
                {
                    "text": "Either party may terminate this Agreement with ninety (90) days written notice to the other party.",
                    "metadata": {"page": 2, "section": "Termination"}
                },
                {
                    "text": "The Service Provider's total liability under this Agreement shall not exceed the total fees paid by the Client in the twelve (12) months preceding the claim.",
                    "metadata": {"page": 5, "section": "Liability"}
                }
            ]
        },
        {
            "filename": "NDA_TechFlow_2024.pdf", 
            "status": "Active",
            "risk_score": "Low",
            "expiry": datetime.now() + timedelta(days=730),
            "chunks": [
                {
                    "text": "The receiving party agrees to maintain confidentiality of all proprietary information disclosed by the disclosing party for a period of five (5) years.",
                    "metadata": {"page": 1, "section": "Confidentiality"}
                },
                {
                    "text": "This Agreement shall automatically renew for successive one-year periods unless either party provides sixty (60) days written notice of non-renewal.",
                    "metadata": {"page": 3, "section": "Renewal"}
                }
            ]
        },
        {
            "filename": "Lease_Agreement_Office.pdf",
            "status": "Renewal Due", 
            "risk_score": "High",
            "expiry": datetime.now() + timedelta(days=45),
            "chunks": [
                {
                    "text": "Monthly rent is due on the first day of each month. Late payments will incur a penalty of 5% of the monthly rent amount.",
                    "metadata": {"page": 2, "section": "Payment Terms"}
                },
                {
                    "text": "Tenant shall provide ninety (90) days notice before the lease expiration date to exercise the renewal option.",
                    "metadata": {"page": 4, "section": "Renewal"}
                }
            ]
        },
        {
            "filename": "Vendor_Contract_Supplies.pdf",
            "status": "Expired",
            "risk_score": "Medium", 
            "expiry": datetime.now() - timedelta(days=30),
            "chunks": [
                {
                    "text": "Payment terms are Net 30 days from invoice date. Early payment discounts of 2% apply if paid within 10 days.",
                    "metadata": {"page": 1, "section": "Payment"}
                },
                {
                    "text": "This contract includes an automatic price adjustment clause tied to the Consumer Price Index, reviewed annually.",
                    "metadata": {"page": 3, "section": "Pricing"}
                }
            ]
        }
    ]
    
    with conn.cursor() as cur:
        # Get user IDs
        cur.execute("SELECT user_id FROM users")
        user_ids = [row[0] for row in cur.fetchall()]
        
        if not user_ids:
            print("Warning: No users found. Creating documents for user_id=1")
            user_ids = [1]
        
        # Create documents for each user
        for user_id in user_ids:
            for contract in contracts:
                try:
                    # Insert document
                    cur.execute("""
                        INSERT INTO documents(user_id, filename, status, risk_score, expiry_date) 
                        VALUES(%s, %s, %s, %s, %s) RETURNING doc_id
                    """, (user_id, contract["filename"], contract["status"], contract["risk_score"], contract["expiry"]))
                    
                    doc_id = cur.fetchone()[0]
                    
                    # Insert chunks
                    for i, chunk_data in enumerate(contract["chunks"]):
                        import uuid
                        chunk_id = str(uuid.uuid4())
                        embedding = mock_embed(chunk_data["text"])
                        metadata = {**chunk_data["metadata"], "contract_name": contract["filename"]}
                        
                        cur.execute("""
                            INSERT INTO chunks(chunk_id, doc_id, user_id, text_chunk, embedding, metadata)
                            VALUES(%s, %s, %s, %s, %s, %s)
                        """, (chunk_id, doc_id, user_id, chunk_data["text"], embedding, metadata))
                        
                except Exception as e:
                    print(f"Warning: Could not create contract {contract['filename']} for user {user_id}: {e}")
    
    conn.commit()
    print("✅ Sample documents and chunks created")

def main():
    """Main initialization function."""
    print("🚀 Initializing ContractHub Database...")
    print("=" * 50)
    
    try:
        conn = get_db_connection()
        print("✅ Database connection established")
        
        # Initialize schema
        init_schema(conn)
        
        # Create sample data
        create_sample_users(conn)
        create_sample_documents(conn)
        
        # Print statistics
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM users")
            user_count = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM documents")  
            doc_count = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM chunks")
            chunk_count = cur.fetchone()[0]
        
        print("=" * 50)
        print("📊 Database Statistics:")
        print(f"   Users: {user_count}")
        print(f"   Documents: {doc_count}")
        print(f"   Chunks: {chunk_count}")
        print("=" * 50)
        print("✅ Database initialization completed successfully!")
        print()
        print("🔑 Demo Login Credentials:")
        print("   Username: demo")
        print("   Password: password123")
        print()
        print("   Username: admin")
        print("   Password: admin123")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
