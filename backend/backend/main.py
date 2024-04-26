from fastapi import FastAPI
from loguru import logger

from backend.config import settings

app = FastAPI()


@app.get("/")
async def root():
    return {"details": "Root!"}


@app.post("/verification")
async def url_verification(token: str, challenge: str, type: str):
    """
    Respond to the Slack verification request with plaintext.
    """
    return challenge
