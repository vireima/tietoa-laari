from cache import AsyncTTL
from loguru import logger
from slack_sdk.errors import SlackApiError
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

        # DEBUG
        logger.debug(f"Found user: {[u for u in user_models if u.id == 'U048USFG5B2']}")

        return [user for user in user_models if not (user.deleted or user.is_bot)]

    @AsyncTTL(time_to_live=60 * 5)
    async def channels(self) -> list[models.SlackChannelModel]:
        """
        Retrieves all channels in the team as a list. Cached for 5 mins.
        """
        CHANNELS_PAGE_LIMIT = 150
        channels = []
        async for page in await self.client.conversations_list(
            limit=CHANNELS_PAGE_LIMIT,
            exclude_archived=True,
            types="public_channel,private_channel,im",
        ):
            channels += page.get("channels", [])

        return [models.SlackChannelModel(**channel) for channel in channels]

    async def channel(self, channel: str) -> models.SlackChannelModel | None:
        """
        Retrieves information about one channel or group.
        """
        async for page in await self.client.conversations_info(channel=channel):
            channel_dict = page.get("channel", None)
            return models.SlackChannelModel(**channel_dict) if channel_dict else None

    async def comments(self, channel: str, ts: str):
        REPLY_PAGE_LIMIT = 150

        replies = []

        try:
            async for page in await self.client.conversations_replies(
                channel=channel, ts=ts, limit=REPLY_PAGE_LIMIT
            ):
                replies += page.get("messages", [])
        except SlackApiError as err:
            logger.warning(str(err))

        return [models.SlackReplyModel(**reply) for reply in replies]


slack_client = Slack()
