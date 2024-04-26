from typing import Any, Callable, Coroutine, Literal

from fastapi import FastAPI, Request
from fastapi.routing import APIRoute, APIRouter
from loguru import logger
from pydantic import BaseModel
from starlette.background import BackgroundTask
from starlette.responses import Response

from backend.config import settings


def log_request(req_body, res_body):
    logger.debug(req_body)


class LogRoute(APIRoute):
    def get_route_handler(self) -> Callable[[Request], Coroutine[Any, Any, Response]]:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            req_body = await request.body()
            response = await original_route_handler(request)
            tasks = response.background

            task = BackgroundTask(log_request, req_body, response.body)

            if tasks:
                tasks.add_task(task)
                response.background = tasks
            else:
                response.background = task

            return response

        return custom_route_handler


app = FastAPI(debug=True)
router = APIRouter(route_class=LogRoute)


@router.get("/")
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


@router.post("/verification")
async def url_verification(
    body: VerificationModel | ReactionEventModel | MessageEventModel,
):
    """
    Respond to the Slack verification request with plaintext.
    """
    if isinstance(body, VerificationModel):
        return body.challenge

    logger.info(f"Got an events! {body}")


app.include_router(router)
