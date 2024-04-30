from cache import AsyncTTL
from slack_sdk.web.async_client import AsyncWebClient

from backend import models
from backend.config import settings


class Slack:
    def __init__(self):
        self.client = AsyncWebClient(token=settings.slack_bot_token)

    @AsyncTTL(time_to_live=60 * 5)
    async def users(self) -> list[models.SlackUserModel]:
        """
        Retrieves all users as a list. Cached for 5 mins.
        """
        USERS_PAGE_LIMIT = 150
        users = []

        async for page in await self.client.users_list(limit=USERS_PAGE_LIMIT):
            users += page.get("members", [])

        user_models = [models.SlackUserModel(**user) for user in users]

        return [user for user in user_models if not (user.deleted or user.is_bot)]

    async def comments(self, channel: str, ts: str):
        REPLY_PAGE_LIMIT = 150

        replies = []
        async for page in await self.client.conversations_replies(
            channel=channel, ts=ts, limit=REPLY_PAGE_LIMIT
        ):
            replies += page.get("messages", [])

        return replies


slack_client = Slack()
