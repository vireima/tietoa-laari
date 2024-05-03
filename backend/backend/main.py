# pyright: reportRedeclaration=false

import random
import string
import sys
import time
import traceback

import orjson
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from loguru import logger
from multimethod import multimethod
from starlette.responses import Response

from backend import models
from backend.database import db
from backend.slack import slack_client

app = FastAPI(debug=True, default_response_class=ORJSONResponse)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_logging(record) -> str:
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
        # "exception": record["exception"],
    }

    if record["exception"] is not None:
        subset["traceback"] = record["exception"]

    subset.update(**record["extra"])

    return orjson.dumps(subset).decode("utf-8")


def sink(message):
    WARNING_LEVEL = 30

    serialized = serialize_logging(message.record)
    print(
        serialized,
        file=sys.stderr if message.record["level"].no >= WARNING_LEVEL else sys.stdout,
    )


logger.remove()
logger.add(sink, level="TRACE")


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    Contextualize logging and send X-Process-Time headers.
    """
    idem = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

    start_time = time.monotonic()

    host, port = (
        (request.client.host, request.client.port)
        if request.client is not None
        else ("", "")
    )

    with logger.contextualize(source=idem, request_host=host, request_port=port):
        body = await request.body()

        try:
            json_body = orjson.loads(body)
        except orjson.JSONDecodeError:
            json_body = body.decode()

        with logger.contextualize(request_payload=json_body):
            logger.info(
                f"Incoming request: {request.method} {request.url.path} (query: {request.query_params}) from {host}:{port}."
            )

        response: Response = await call_next(request)

        process_time = time.monotonic() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        logger.info(f"{response.status_code} ({process_time:.2f}s)")

    return response


@app.get("/")
async def root():
    try:
        # raise ValueError("Lol virhe tässä!")
        return {"details": "Root!"}

    except Exception as ex:

        with logger.contextualize(exception=traceback.format_tb(ex.__traceback__)):
            logger.error("Virhe")


@logger.catch
@app.get("/tasks")
async def get_tasks():
    return await db.query()


@logger.catch
@app.get("/tasks/{channel}")
async def get_tasks_by_channel(channel: str):
    return await db.query(channel=channel)


@logger.catch
@app.get("/tasks/{channel}/{ts}")
async def get_task(channel: str, ts: str):

    return await db.query(channel=channel, ts=ts)


@logger.catch
@app.get("/tasks/{channel}/{ts}/comments")
async def get_task_comments(channel: str, ts: str):
    return await slack_client.comments(channel, ts)


@logger.catch
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    return await db.delete(task_id)


@logger.catch
@app.patch("/tasks")
async def patch_tasks(tasks: list[models.TaskUpdateModel]):
    return await db.patch(tasks)


@logger.catch
@app.delete("/tasks")
async def delete_tasks(tasks: list[models.TaskUpdateModel]):
    return await db.delete(tasks)


@logger.catch
@app.get("/users")
async def get_users():
    return await slack_client.users()


@logger.catch
@app.post("/event")
async def events_api_endpoint(
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


### Events API ###


@multimethod
async def process(event: models.VerificationModel) -> str:
    """
    Respond to the Slack verification request with plaintext.
    """
    return event.challenge


@multimethod
async def process(event: models.MentionEventModel) -> None:  # noqa: F811
    logger.success(f"Mention event! '{event.event.text}' by {event.event.user}")


@multimethod
async def process(event: models.ReactionEventModel) -> None:  # noqa: F811
    logger.success(
        f"Reaction event! {event.event.type} {event.event.reaction} by {event.event.user}"
    )

    vote = models.Reaction(reaction=event.event.reaction, user=event.event.user)

    match event.event.type:
        case "reaction_added":
            await db.add_task_votes(vote, event.event.item.channel, event.event.item.ts)
        case "reaction_removed":
            await db.remove_task_votes(
                vote, event.event.item.channel, event.event.item.ts
            )


@multimethod
async def process(event: models.MessageEventModel) -> None:  # noqa: F811
    logger.trace("Processing a message")
    await process_message_subtypes(event.event)


@multimethod
async def process_message_subtypes(msg: models.InnerMessageEvent) -> None:
    logger.trace("Processing a new message")
    if msg.thread_ts is not None:
        logger.debug("This is a thread reply.")
        parent_tasks = await db.query(ts=msg.thread_ts, channel=msg.channel)

        if parent_tasks:
            logger.debug(f"Parent task: '{parent_tasks[0].description}'.")
        else:
            logger.warning("A reply to a thread that cannot be found.")
    else:
        await db.insert_task(msg)
        logger.success("Inserted a task.")


@multimethod
async def process_message_subtypes(  # noqa: F811
    msg: models.InnerMessageChangedEvent,
) -> None:
    logger.trace("Processing an update message")
    result = await db.update_task(msg)
    if not result:
        logger.error(f"Update failed: {msg.channel}/{msg.ts} '{msg.message.text}'")
    else:
        logger.success(
            f"Updated a task: description='{result.description}', mod={result.modified}"
        )


@multimethod
async def process_message_subtypes(  # noqa: F811
    msg: models.InnerMessageDeletedEvent,
) -> None:
    logger.trace("Processing a deletion")
    logger.warning(f"Message deleted in Slack ({msg.channel}/{msg.deleted_ts})")
