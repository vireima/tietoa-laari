from fastapi import FastAPI

from backend.config import settings

app = FastAPI()


@app.get("/")
async def root():
    return {"details": "Root!"}
