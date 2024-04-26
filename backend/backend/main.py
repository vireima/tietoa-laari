import json
import random
import string
import sys
import time
from typing import Any, Callable, Coroutine, Literal

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError, ValidationException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute, APIRouter
from loguru import logger
from multimethod import multimethod
from pydantic import BaseModel
from starlette.background import BackgroundTask
from starlette.responses import Response

from backend.config import settings

app = FastAPI(debug=True)


def serialize_logging(record):
    subset = {
        # Required by Railway
        "msg": record["message"],
        "level": record["level"].name,
        # Custom attributes
        "timestamp": record["time"].timestamp(),
        "file": record["file"],
        "function": record["function"],
        "line": record["line"],
        "source": record["extra"]["source"],
    }

    return json.dumps(subset)


def patch_logging(record):
    record["extra"]["serialized"] = serialize_logging(record)


logger.remove()
logger = logger.patch(patch_logging)
logger.add(
    sys.stderr,
    format="{level.icon} {level: <8} | "
    "{name}:{function}:{line} [{extra[source]}] - <level>{message}</level>",
    level="TRACE",
    serialize=True,
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    idem = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

    start_time = time.monotonic()

    with logger.contextualize(source=idem, host=request.client.host):
        json_body = await request.json()
        with logger.contextualize(request=json_body):
            logger.info(
                f"Incoming request {request.method} {request.url.path} (query: {request.query_params}) from {request.client.host}:{request.client.port}."
            )

        response = await call_next(request)
        process_time = time.monotonic() - start_time
        response.headers["X-Process-Time"] = str(process_time)

        logger.info(f"{request.method} {request.url} ({process_time:.2f}s) {json_body}")

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


class InnerMessageEvent(BaseModel):
    type: Literal["message"]
    channel: str
    user: str
    text: str
    ts: str
    team: str
    event_ts: str
    channel_type: str
    # blocks: [{ ... }]


class InnerMentionEvent(BaseModel):
    type: Literal["app_mention"]
    channel: str
    user: str
    text: str
    event_ts: str
    # channel_type: str
    team: str
    ts: str
    team: str
    # blocks: [{ ... }]


class InnerReactionEvent(BaseModel):
    type: Literal["reaction_added", "reaction_removed"]
    user: str
    reaction: str
    item_user: str
    event_ts: str
    # item { type: "message", ... }


class MessageEventModel(EventsWrapper):
    event: InnerMessageEvent


class ReactionEventModel(EventsWrapper):
    event: InnerReactionEvent


class MentionEventModel(EventsWrapper):
    event: InnerMentionEvent


class VerificationModel(BaseModel):
    token: str
    challenge: str
    type: Literal["url_verification"]


@app.post("/verification")
async def url_verification(
    body: (
        VerificationModel | ReactionEventModel | MessageEventModel | MentionEventModel
    ),
):
    """
    Respond to an incoming Slack Events API event.
    """
    logger.info(f"Got an event! {body}")
    return process(body)


@multimethod
def process(event: VerificationModel) -> str:
    """
    Respond to the Slack verification request with plaintext.
    """
    return event.challenge


@multimethod
def process(event: MentionEventModel) -> None:
    logger.success(f"Mention event! '{event.event.text}' by {event.event.user}")


@multimethod
def process(event: ReactionEventModel) -> None:
    logger.success(
        f"Reaction event! {event.event.type} {event.event.reaction} by {event.event.user}"
    )


@multimethod
def process(event: MessageEventModel) -> None:
    logger.success(f"Message! '{event.event.text}' by {event.event.user}")
