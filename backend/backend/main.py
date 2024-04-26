from typing import Literal

from fastapi import FastAPI, Request
from loguru import logger
from pydantic import BaseModel

from backend.config import settings

app = FastAPI()


@app.get("/")
async def root():
    return {"details": "Root!"}


class VerificationModel(BaseModel):
    token: str
    challenge: str
    type: Literal["url_verification"]


@app.post("/verification")
async def url_verification(body: VerificationModel):
    """
    Respond to the Slack verification request with plaintext.
    """
    return body.challenge


@app.post("/debug")
async def debug(request: Request):
    logger.debug(request.body)
    logger.debug(request)
