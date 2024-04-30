from datetime import datetime
from enum import Enum
from typing import Annotated, Literal

import arrow
import pytz
from bson import ObjectId
from pydantic import AnyHttpUrl, BaseModel, BeforeValidator, Field

TZ_UTC = pytz.timezone("UTC")
TZ_LOCAL = pytz.timezone("Europe/Helsinki")


def validate_object_id(value: ObjectId) -> str:
    return str(value)


PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]


def validate_utc_datetime(dt: datetime | str) -> datetime:
    """
    Validate a datetime and force naive datetimes to be tz aware. Naive datetimes default to utc.
    """
    if isinstance(dt, str):
        dt = arrow.get(dt).datetime
    return TZ_UTC.localize(dt) if dt.tzinfo is None else dt


def validate_local_datetime(dt: datetime | str) -> datetime:
    """
    Validate a datetime and force naive datetimes to be tz aware. Naive datetimes default to local tz.
    """
    if isinstance(dt, str):
        dt = arrow.get(dt).datetime
    return TZ_LOCAL.localize(dt) if dt.tzinfo is None else dt


DatetimeUTC = Annotated[datetime, BeforeValidator(validate_utc_datetime)]
DatetimeLocal = Annotated[datetime, BeforeValidator(validate_local_datetime)]


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
    thread_ts: str | None = None
    parent_user_id: str | None = None
    # blocks: [{ ... }]


class ChangedMessage(BaseModel):
    type: Literal["message"]
    text: str
    user: str
    ts: str
    thread_ts: str | None = None
    parent_user_id: str | None = None
    # edited: { ... }


class InnerMessageChangedEvent(BaseModel):
    type: Literal["message"]
    channel: str
    ts: str
    event_ts: str
    channel_type: str
    subtype: Literal["message_changed"]
    message: ChangedMessage


class InnerMessageDeletedEvent(BaseModel):
    type: Literal["message"]
    channel: str
    deleted_ts: str
    event_ts: str
    channel_type: str
    subtype: Literal["message_deleted"]


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


class ReactionItem(BaseModel):
    channel: str
    ts: str
    type: str  # most likely "message"


class InnerReactionEvent(BaseModel):
    type: Literal["reaction_added", "reaction_removed"]
    user: str
    reaction: str
    item_user: str
    event_ts: str
    item: ReactionItem


class MessageEventModel(EventsWrapper):
    event: InnerMessageEvent | InnerMessageChangedEvent | InnerMessageDeletedEvent


class ReactionEventModel(EventsWrapper):
    event: InnerReactionEvent


class MentionEventModel(EventsWrapper):
    event: InnerMentionEvent


class VerificationModel(BaseModel):
    token: str
    challenge: str
    type: Literal["url_verification"]


class Reaction(BaseModel):
    reaction: str
    user: str


class StatusEnum(str, Enum):
    todo = "todo"
    in_progress = "in progress"
    done = "done"
    closed = "closed"


# Task models
class TaskInputModel(BaseModel):
    author: str
    assignee: str | None = None
    channel: str
    ts: str
    description: str | None = None
    priority: int = 0
    created: DatetimeUTC
    modified: DatetimeUTC
    votes: list[Reaction] = Field(default_factory=list)
    status: StatusEnum = StatusEnum.todo


class TaskUpdateModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    assignee: str | None = None
    description: str | None = None
    priority: int | None = None
    modified: DatetimeUTC | None = None
    votes: list[Reaction] | None = None
    status: StatusEnum | None = None


class TaskOutputModel(TaskInputModel):
    id: PyObjectId = Field(alias="_id")


# User models
class SlackProfileModel(BaseModel):
    real_name: str
    display_name: str
    status_text: str
    status_emoji: str
    image_32: AnyHttpUrl
    image_512: AnyHttpUrl


class SlackUserModel(BaseModel):
    id: str
    color: str | None = None
    deleted: bool
    name: str
    updated: int
    profile: SlackProfileModel
    is_bot: bool
