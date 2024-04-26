from datetime import datetime
from typing import Literal

from pydantic import BaseModel


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
    created: datetime | None = None
    modified: datetime | None = None
