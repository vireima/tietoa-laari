from datetime import datetime
from typing import Annotated, Literal

import arrow
import pytz
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

TZ_UTC = pytz.timezone("UTC")
TZ_LOCAL = pytz.timezone("Europe/Helsinki")


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
    event: InnerMessageEvent


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


# Task models
class TaskModel(BaseModel):
    model = ConfigDict(extra="allow")
    author: str
    assignee: str | None = None
    channel: str
    ts: str
    description: str
    priority: int = 0
    created: DatetimeUTC | None = None
    modified: DatetimeUTC | None = None
    votes: list[Reaction] = Field(default_factory=list)


# class Task:
#     def __init__(self, task:TaskModel, db:Database):
#         self.task = task
#         self.db = db

#     def add_vote(self, reaction: str, user: str) -> None:
#         self.votes.append(Reaction(reaction=reaction, user=user))

#     def remove_vote(self, reaction: str, user: str) -> None:
#         self.votes.remove(Reaction(reaction=reaction, user=user))
