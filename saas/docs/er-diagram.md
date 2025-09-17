# ER Diagram

Tables: `users`, `documents`, `chunks`.

- users (user_id PK) 1----* documents (doc_id PK)
- users (user_id PK) 1----* chunks (chunk_id PK)
- documents (doc_id PK) 1----* chunks (doc_id FK)

Columns:
- users: user_id, username, password_hash
- documents: doc_id, user_id, filename, uploaded_on, expiry_date, status, risk_score
- chunks: chunk_id, doc_id, user_id, text_chunk, embedding (vector), metadata

See `docs/er-diagram.svg` for the image.
