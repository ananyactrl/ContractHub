-- ContractHub Database Setup for Supabase
-- Run this script in your Supabase SQL Editor

-- Enable pgvector extension (if not already done)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    doc_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    filename VARCHAR(512) NOT NULL,
    uploaded_on TIMESTAMP NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMP NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    risk_score VARCHAR(16) NOT NULL DEFAULT 'Low'
);

-- Create chunks table with pgvector
CREATE TABLE IF NOT EXISTS chunks (
    chunk_id VARCHAR(64) PRIMARY KEY,
    doc_id INTEGER NOT NULL REFERENCES documents(doc_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    text_chunk TEXT NOT NULL,
    embedding VECTOR(8) NOT NULL,
    metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chunks_user ON chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(doc_id);
CREATE INDEX IF NOT EXISTS idx_chunks_vec ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);

-- Insert demo users
INSERT INTO users(username, password_hash) VALUES
('demo', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5'),
('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
('john.doe', '66ce1d6bb35b6d8c0b12a5c3b2a3f0c9c8c8e8f5f1f5e5e5c5c5c5c5c5c5c5c5'),
('jane.smith', 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd4')
ON CONFLICT (username) DO NOTHING;

-- Insert sample documents
INSERT INTO documents(user_id, filename, status, risk_score, expiry_date) VALUES
(1, 'Service_Agreement_2024.pdf', 'Active', 'Medium', NOW() + INTERVAL '365 days'),
(1, 'NDA_TechFlow_2024.pdf', 'Active', 'Low', NOW() + INTERVAL '730 days'),
(1, 'Lease_Agreement_Office.pdf', 'Renewal Due', 'High', NOW() + INTERVAL '45 days'),
(1, 'Vendor_Contract_Supplies.pdf', 'Expired', 'Medium', NOW() - INTERVAL '30 days'),
(2, 'Service_Agreement_2024.pdf', 'Active', 'Medium', NOW() + INTERVAL '365 days'),
(2, 'NDA_TechFlow_2024.pdf', 'Active', 'Low', NOW() + INTERVAL '730 days');

-- Insert sample chunks with mock embeddings
INSERT INTO chunks(chunk_id, doc_id, user_id, text_chunk, embedding, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 1, 'Termination clause: Either party may terminate with 90 days'' notice.', '[0.12, -0.45, 0.91, 0.33, 0.15, -0.22, 0.67, 0.89]', '{"page": 2, "section": "Termination", "contract_name": "Service_Agreement_2024.pdf"}'),
('550e8400-e29b-41d4-a716-446655440002', 1, 1, 'Liability cap: Limited to 12 months'' fees.', '[0.01, 0.22, -0.87, 0.44, 0.56, -0.33, 0.78, 0.12]', '{"page": 5, "section": "Liability", "contract_name": "Service_Agreement_2024.pdf"}'),
('550e8400-e29b-41d4-a716-446655440003', 2, 1, 'Confidentiality period: 5 years from disclosure.', '[0.33, -0.67, 0.55, 0.23, 0.78, -0.44, 0.91, 0.06]', '{"page": 1, "section": "Confidentiality", "contract_name": "NDA_TechFlow_2024.pdf"}'),
('550e8400-e29b-41d4-a716-446655440004', 3, 1, 'Monthly rent due first of each month. 5% late penalty.', '[0.67, -0.12, 0.34, 0.89, 0.23, -0.56, 0.77, 0.45]', '{"page": 2, "section": "Payment", "contract_name": "Lease_Agreement_Office.pdf"}'),
('550e8400-e29b-41d4-a716-446655440005', 4, 1, 'Payment terms are Net 30 days from invoice date.', '[0.45, -0.78, 0.23, 0.67, 0.12, -0.89, 0.56, 0.34]', '{"page": 1, "section": "Payment", "contract_name": "Vendor_Contract_Supplies.pdf"}'),
('550e8400-e29b-41d4-a716-446655440006', 5, 2, 'Termination clause: Either party may terminate with 90 days'' notice.', '[0.12, -0.45, 0.91, 0.33, 0.15, -0.22, 0.67, 0.89]', '{"page": 2, "section": "Termination", "contract_name": "Service_Agreement_2024.pdf"}'),
('550e8400-e29b-41d4-a716-446655440007', 6, 2, 'Confidentiality period: 5 years from disclosure.', '[0.33, -0.67, 0.55, 0.23, 0.78, -0.44, 0.91, 0.06]', '{"page": 1, "section": "Confidentiality", "contract_name": "NDA_TechFlow_2024.pdf"}');

-- Verify the setup
SELECT 'Users created:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Documents created:', COUNT(*) FROM documents  
UNION ALL
SELECT 'Chunks created:', COUNT(*) FROM chunks;

-- Test vector search functionality
SELECT 
    text_chunk,
    embedding <-> '[0.12, -0.45, 0.91, 0.33, 0.15, -0.22, 0.67, 0.89]' as distance
FROM chunks 
WHERE user_id = 1 
ORDER BY distance ASC 
LIMIT 3;
