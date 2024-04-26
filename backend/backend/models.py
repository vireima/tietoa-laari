from datetime import datetime
from typing import Literal

import arrow
import pytz
from pydantic import AnyHttpUrl, BaseModel, BeforeValidator, Field
from typing_extensions import Annotated

TZ_UTC = pytz.timezone("UTC")
TZ_LOCAL = pytz.timezone("Europe/Helsinki")


def validate_utc_datetime(dt: datetime.datetime | str) -> datetime:
    """
    Validate a datetime and force naive datetimes to be tz aware. Naive datetimes default to utc.
    """
    if isinstance(dt, str):
        dt = arrow.get(dt).datetime
    return TZ_UTC.localize(dt) if dt.tzinfo is None else dt


def validate_local_datetime(dt: datetime.datetime | str) -> datetime:
    """
    Validate a datetime and force naive datetimes to be tz aware. Naive datetimes default to local tz.
    """
    if isinstance(dt, str):
        dt = arrow.get(dt).datetime
    return TZ_LOCAL.localize(dt) if dt.tzinfo is None else dt


DatetimeUTC = Annotated[datetime.datetime, BeforeValidator(validate_utc_datetime)]
DatetimeLocal = Annotated[datetime.datetime, BeforeValidator(validate_local_datetime)]


# Slack input models
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
    subtype: str | None = None
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


# Task models
class TaskModel(BaseModel):
    author: str
    assignee: str | None = None
    channel: str
    ts: str
    description: str
    priority: int = 0
    created: DatetimeUTC | None = None
    modified: DatetimeUTC | None = None
