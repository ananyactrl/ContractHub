CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
	doc_id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	filename VARCHAR(512) NOT NULL,
	uploaded_on TIMESTAMP NOT NULL DEFAULT NOW(),
	expiry_date TIMESTAMP NULL,
	status VARCHAR(32) NOT NULL DEFAULT 'Active',
	risk_score VARCHAR(16) NOT NULL DEFAULT 'Low'
);

CREATE TABLE IF NOT EXISTS chunks (
    chunk_id VARCHAR(64) PRIMARY KEY,
    doc_id INTEGER NOT NULL REFERENCES documents(doc_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    text_chunk TEXT NOT NULL,
    embedding VECTOR(8) NOT NULL,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_chunks_user ON chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(doc_id);
CREATE INDEX IF NOT EXISTS idx_chunks_vec ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
