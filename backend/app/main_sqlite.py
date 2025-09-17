# Temporary compatibility file to fix Render deployment
# This imports the correct Postgres main app
from .main import app

# Re-export the app so uvicorn can find it
__all__ = ["app"]
