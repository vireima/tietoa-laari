import random
import string
import sys
import time
from typing import Any, Callable, Coroutine, Literal

import orjson
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError, ValidationException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute, APIRouter
from loguru import logger
from multimethod import multimethod
from pydantic import BaseModel
from starlette.background import BackgroundTask
from starlette.responses import Response

from backend import database, models
from backend.config import settings

app = FastAPI(debug=True)


def serialize_logging(record):
    level_name_mapping = {
        "trace": "debug",
        "debug": "debug",
        "info": "info",
        "success": "info",
        "warning": "warn",
        "error": "error",
        "critical": "error",
    }

    subset = {
        # Required by Railway
        "msg": record["message"],
        "level": level_name_mapping.get(record["level"].name.lower(), "info"),
        # Custom attributes
        "original_level": record["level"].name,
        "timestamp": record["time"].timestamp(),
        "file": record["file"].name,
        "function": record["function"],
        "line": record["line"],
    }

    subset.update(**record["extra"])

    return orjson.dumps(subset)


def sink(message):
    serialized = serialize_logging(message.record)
    print(
        serialized, file=sys.stderr if message.record["level"].no >= 30 else sys.stdout
    )


logger.remove()
logger.add(sink, level="TRACE")


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    idem = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

    start_time = time.monotonic()

    with logger.contextualize(source=idem, request_host=request.client.host):
        body = await request.body()

        try:
            json_body = orjson.loads(body)
        except orjson.JSONDecodeError as err:
            json_body = body

        with logger.contextualize(request_payload=json_body):
            logger.info(
                f"Incoming request: {request.method} {request.url.path} (query: {request.query_params}) from {request.client.host}:{request.client.port}."
            )

        response: Response = await call_next(request)

        process_time = time.monotonic() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        logger.info(f"{response.status_code} ({process_time:.2f}s)")

    return response


@app.get("/")
async def root():
    return {"details": "Root!"}


@app.get("/tasks")
async def get_tasks():
    return await database.query()


@app.get("/tasks/{task_id}")
async def get_task(task_id: str):
    return await database.query(task_id)


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    return await database.delete(task_id)


@app.post("/verification")
async def url_verification(
    body: (
        models.VerificationModel
        | models.ReactionEventModel
        | models.MessageEventModel
        | models.MentionEventModel
    ),
):
    """
    Respond to an incoming Slack Events API event.
    """
    return await process(body)


@multimethod
async def process(event: models.VerificationModel) -> str:
    """
    Respond to the Slack verification request with plaintext.
    """
    return event.challenge


@multimethod
async def process(event: models.MentionEventModel) -> None:
    logger.success(f"Mention event! '{event.event.text}' by {event.event.user}")


@multimethod
async def process(event: models.ReactionEventModel) -> None:
    logger.success(
        f"Reaction event! {event.event.type} {event.event.reaction} by {event.event.user}"
    )


@multimethod
async def process(event: models.MessageEventModel) -> None:
    await database.insert_task(event)
    logger.success("Inserted a task.")
