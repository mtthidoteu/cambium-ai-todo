import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import tasks

app = FastAPI(title="Todo API", version="1.0.0")

# Get CORS origins from environment variable, default to localhost:5173
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/debug/time")
async def debug_time():
    from datetime import datetime, timezone
    import time
    now_utc = datetime.now(timezone.utc)
    now_naive = datetime.now()
    return {
        "server_utc": now_utc.isoformat(),
        "server_naive": now_naive.isoformat(),
        "unix_timestamp": time.time(),
        "timezone_info": str(now_utc.tzinfo)
    }

app.include_router(tasks.router)
