import os
from typing import AsyncGenerator

import asyncpg

DATABASE_URL = os.getenv("DATABASE_URL", "")


_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set")
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    return _pool


async def connection() -> AsyncGenerator[asyncpg.Connection, None]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        yield conn


