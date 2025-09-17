#!/usr/bin/env python3
"""
Supabase setup script for ContractHub SaaS
Sets up the database schema and sample data specifically for Supabase.
"""

import os
import psycopg2
import hashlib
from datetime import datetime, timedelta
import uuid
import json

# Supabase connection details (direct connection)
SUPABASE_URL = "postgresql://postgres:shreyasananya@db.iftmelhmlsngxdcuryuu.supabase.co:5432/postgres"

def get_supabase_connection():
    """Get Supabase connection."""
    return psycopg2.connect(SUPABASE_URL)

def setup_database():
    """Set up the database schema and sample data."""
    print("🚀 Setting up ContractHub on Supabase...")
    print("=" * 50)
    
    try:
        conn = get_supabase_connection()
        print("✅ Supabase connection established")
        
        with conn.cursor() as cur:
            # Enable pgvector extension
            print("📦 Enabling pgvector extension...")
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            
            # Create tables
            print("🏗️  Creating database schema...")
            
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
            print("📊 Creating database indexes...")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_user ON chunks(user_id);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(doc_id);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_vec ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);")
            
            # Create sample users
            print("👥 Creating sample users...")
            users = [
                ("demo", "password123"),
                ("admin", "admin123"),
                ("john.doe", "secure123"),
                ("jane.smith", "password456")
            ]
            
            for username, password in users:
                pw_hash = hashlib.sha256(password.encode()).hexdigest()
                try:
                    cur.execute(
                        "INSERT INTO users(username, password_hash) VALUES(%s, %s) ON CONFLICT (username) DO NOTHING",
                        (username, pw_hash)
                    )
                except Exception as e:
                    print(f"⚠️  Warning: Could not create user {username}: {e}")
            
            # Create sample documents and chunks
            print("📄 Creating sample contracts...")
            
            def mock_embed(text: str) -> list[float]:
                """Generate mock embeddings."""
                h = hashlib.sha256(text.encode()).digest()
                vals = [int.from_bytes(h[i:i+4], 'big', signed=False) % 1000 / 1000 for i in range(0, 32, 4)]
                return vals[:8]
            
            contracts = [
                {
                    "filename": "Service_Agreement_2024.pdf",
                    "status": "Active",
                    "risk_score": "Medium",
                    "expiry": datetime.now() + timedelta(days=365),
                    "chunks": [
                        {
                            "text": "Termination clause: Either party may terminate with 90 days' notice.",
                            "metadata": {"page": 2, "section": "Termination"}
                        },
                        {
                            "text": "Liability cap: Limited to 12 months' fees.",
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
                            "text": "Confidentiality period: 5 years from disclosure.",
                            "metadata": {"page": 1, "section": "Confidentiality"}
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
                            "text": "Monthly rent due first of each month. 5% late penalty.",
                            "metadata": {"page": 2, "section": "Payment"}
                        }
                    ]
                }
            ]
            
            # Get user IDs
            cur.execute("SELECT user_id FROM users")
            user_ids = [row[0] for row in cur.fetchall()]
            
            if not user_ids:
                print("⚠️  No users found, creating default user")
                cur.execute("INSERT INTO users(username, password_hash) VALUES('default', 'hash') RETURNING user_id")
                user_ids = [cur.fetchone()[0]]
            
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
                        for chunk_data in contract["chunks"]:
                            chunk_id = str(uuid.uuid4())
                            embedding = mock_embed(chunk_data["text"])
                            metadata = {**chunk_data["metadata"], "contract_name": contract["filename"]}
                            
                            cur.execute("""
                                INSERT INTO chunks(chunk_id, doc_id, user_id, text_chunk, embedding, metadata)
                                VALUES(%s, %s, %s, %s, %s, %s)
                            """, (chunk_id, doc_id, user_id, chunk_data["text"], embedding, metadata))
                            
                    except Exception as e:
                        print(f"⚠️  Warning: Could not create contract {contract['filename']}: {e}")
        
        conn.commit()
        
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
        print("✅ Supabase setup completed successfully!")
        print()
        print("🔑 Demo Login Credentials:")
        print("   Username: demo")
        print("   Password: password123")
        print()
        print("   Username: admin")
        print("   Password: admin123")
        print()
        print("🌐 Your backend will connect to:")
        print("   Database: Supabase PostgreSQL + pgvector")
        print("   URL: ✅ Connected and ready!")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error setting up Supabase: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check if your Supabase project is active")
        print("2. Verify the connection string is correct")
        print("3. Ensure pgvector extension is enabled")
        return False
    
    return True

if __name__ == "__main__":
    success = setup_database()
    if success:
        print("\n🎉 Ready to deploy! Your Supabase database is fully configured.")
    else:
        print("\n❌ Setup failed. Please check the connection and try again.")
