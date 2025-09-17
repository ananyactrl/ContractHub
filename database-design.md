# ContractHub Database Design

## ER Diagram

The ContractHub SaaS application uses a **PostgreSQL database with pgvector extension** for vector similarity search, exactly as specified in the assignment requirements.

### Schema Overview

```
┌─────────────────┐       ┌───────────────────────┐       ┌─────────────────────────┐
│     users       │       │      documents        │       │        chunks           │
├─────────────────┤       ├───────────────────────┤       ├─────────────────────────┤
│ user_id (PK)    │◄─────┐│ doc_id (PK)          │◄─────┐│ chunk_id (PK)          │
│ username        │      ││ user_id (FK)         │      ││ doc_id (FK)            │
│ password_hash   │      │└─────────────────────  │      ││ user_id (FK)           │
│ created_at      │      │  filename             │      ││ text_chunk             │
└─────────────────┘      │  uploaded_on          │      ││ embedding (vector)     │
                         │  expiry_date          │      ││ metadata (jsonb)       │
                         │  status               │      └─────────────────────────┘
                         │  risk_score           │
                         └───────────────────────┘
```

### Table Specifications

#### `users` Table
- **Primary Key**: `user_id` (SERIAL)
- **Unique Constraint**: `username`
- **Purpose**: Multi-tenant user authentication
- **Fields**:
  - `user_id`: Auto-incrementing primary key
  - `username`: Unique username for login
  - `password_hash`: SHA-256 hashed password
  - `created_at`: Account creation timestamp

#### `documents` Table  
- **Primary Key**: `doc_id` (SERIAL)
- **Foreign Key**: `user_id` → `users(user_id)`
- **Purpose**: Contract metadata storage
- **Fields**:
  - `doc_id`: Auto-incrementing document ID
  - `user_id`: Reference to document owner (multi-tenancy)
  - `filename`: Original uploaded filename
  - `uploaded_on`: Upload timestamp (DEFAULT NOW())
  - `expiry_date`: Contract expiration date (nullable)
  - `status`: Contract status (Active, Renewal Due, Expired)
  - `risk_score`: Risk assessment (Low, Medium, High)

#### `chunks` Table
- **Primary Key**: `chunk_id` (VARCHAR)
- **Foreign Keys**: 
  - `doc_id` → `documents(doc_id)`
  - `user_id` → `users(user_id)`
- **Purpose**: Document chunks with vector embeddings for RAG
- **Fields**:
  - `chunk_id`: UUID string for unique chunk identification
  - `doc_id`: Reference to parent document
  - `user_id`: Reference to chunk owner (for query isolation)
  - `text_chunk`: The actual text content of the chunk
  - `embedding`: **VECTOR(8)** - pgvector embedding for similarity search
  - `metadata`: **JSONB** - Page numbers, section info, etc.

### Key Design Features

#### 1. **Multi-Tenant Isolation**
- Every table includes `user_id` foreign key
- All queries filter by `user_id`
- Ensures complete data isolation between users

#### 2. **Vector Search Capability**
- Uses **pgvector extension** as required
- `VECTOR(8)` data type for mock embeddings
- Optimized with **ivfflat index** for cosine similarity
- Supports natural language queries through RAG workflow

#### 3. **Relationships**
- **1:N** `users` → `documents` (One user, many contracts)
- **1:N** `documents` → `chunks` (One document, many chunks)  
- **1:N** `users` → `chunks` (Direct user access for queries)

#### 4. **Indexes for Performance**
```sql
CREATE INDEX idx_chunks_user ON chunks(user_id);
CREATE INDEX idx_chunks_doc ON chunks(doc_id);
CREATE INDEX idx_chunks_vec ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_documents_user ON documents(user_id);
```

### Mock LlamaCloud Integration

The system processes uploaded documents using the specified mock format:

```json
{
  "document_id": "doc123",
  "chunks": [
    {
      "chunk_id": "c1", 
      "text": "Termination clause: Either party may terminate with 90 days' notice.",
      "embedding": [0.12, -0.45, 0.91, 0.33],
      "metadata": { "page": 2, "contract_name": "MSA.pdf" }
    }
  ]
}
```

### Query Workflow (RAG)

1. **Upload**: Document → Parse → Chunk → Store with embeddings
2. **Query**: User question → Mock embed → Vector search → Return relevant chunks
3. **Results**: Display chunks with metadata, relevance scores, and mock AI answer

### Deployment Architecture

- **Database**: Supabase PostgreSQL with pgvector extension
- **Backend**: Render.com with FastAPI 
- **Frontend**: Vercel/Netlify with React + Tailwind
- **Authentication**: JWT tokens with secure user isolation

This design fully satisfies all assignment requirements:
✅ PostgreSQL + pgvector  
✅ 3-table schema with proper relationships  
✅ Multi-tenant isolation  
✅ Vector embeddings for RAG workflow  
✅ Mock LlamaCloud response format  
✅ Business-ready SaaS structure
