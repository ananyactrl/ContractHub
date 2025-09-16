import os
import time
from typing import Optional

import jwt
from fastapi import HTTPException, status

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = "HS256"
JWT_EXP_SECS = 60 * 60 * 24 * 7


def create_token(user_id: str) -> str:
  now = int(time.time())
  payload = {"sub": user_id, "iat": now, "exp": now + JWT_EXP_SECS}
  return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def parse_token(token: str) -> str:
  try:
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    return str(payload.get("sub"))
  except Exception:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


