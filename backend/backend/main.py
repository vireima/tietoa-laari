import time
from typing import Any, Callable, Coroutine, Literal

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError, ValidationException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute, APIRouter
from loguru import logger
from pydantic import BaseModel
from starlette.background import BackgroundTask
from starlette.responses import Response

from backend.config import settings

app = FastAPI(debug=True)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.monotonic()
    json_body = await request.json()
    response = await call_next(request)
    process_time = time.monotonic() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    logger.info(f"{request.method} {request.url} {json_body}")
    return response


@app.get("/")
async def root():
    return {"details": "Root!"}


class EventsWrapper(BaseModel):
    type: Literal["event_callback"]
    event_id: str
    event_time: int
    token: str
    team_id: str
    api_app_id: str


class InnerMessageEvent(EventsWrapper):
    type: Literal["message"]
    channel: str
    user: str
    text: str
    ts: str
    event_ts: str
    channel_type: str


class InnerReactionEvent(BaseModel):
    type: Literal["reaction_added", "reaction_removed"]
    user: str
    reaction: str
    item_user: str
    event_ts: str


class MessageEventModel(EventsWrapper):
    event: InnerMessageEvent


class ReactionEventModel(EventsWrapper):
    event: InnerReactionEvent


class VerificationModel(BaseModel):
    token: str
    challenge: str
    type: Literal["url_verification"]


@app.post("/verification")
async def url_verification(
    body: VerificationModel | ReactionEventModel | MessageEventModel,
):
    """
    Respond to the Slack verification request with plaintext.
    """
    if isinstance(body, VerificationModel):
        return body.challenge

    logger.info(f"Got an events! {body}")


async def http422_error_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    logger.error(_.json())
    return JSONResponse(
        {"errors": exc.errors()}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


app.add_exception_handler(RequestValidationError, http422_error_handler)
