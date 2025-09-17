import os
from typing import Generator

import psycopg2
from psycopg2.pool import SimpleConnectionPool

DATABASE_URL = os.getenv("DATABASE_URL", "")


_pool: SimpleConnectionPool | None = None


def get_pool() -> SimpleConnectionPool:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set")
    global _pool
    if _pool is None:
        _pool = SimpleConnectionPool(1, 5, DATABASE_URL)
    return _pool


def connection() -> Generator[psycopg2.extensions.connection, None, None]:
    pool = get_pool()
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)


