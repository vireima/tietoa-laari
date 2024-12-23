from cache import AsyncTTL
from loguru import logger
from slack_sdk.errors import SlackApiError
from slack_sdk.web.async_client import AsyncWebClient

from backend import models
from backend.config import settings
from backend.security import decrypt, encrypt, jwt_decode, jwt_encode


class Slack:
    def __init__(self):
        self.client = AsyncWebClient(token=settings.slack_bot_token)

    @AsyncTTL(time_to_live=60 * 15)
    async def users(self) -> list[models.SlackUserModel]:
        """
        Retrieves all users as a list. Cached for 15 mins.
        """
        USERS_PAGE_LIMIT = 150
        users = []

        async for page in await self.client.users_list(limit=USERS_PAGE_LIMIT):
            users += page.get("members", [])

        user_models = [models.SlackUserModel(**user) for user in users]

        return [user for user in user_models if not (user.deleted)]

    @AsyncTTL(time_to_live=60 * 15)
    async def channels(self) -> list[models.SlackChannelModel]:
        """
        Retrieves all channels in the team as a list. Cached for 15 mins.
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

    async def auth(self, code: str) -> str:
        """
        Exchanges a temporary Slack auth code for an (encrypted) access token.
        """
        oauth_response = await self.client.oauth_v2_access(
            client_id=settings.slack_client_id,
            client_secret=settings.slack_client_secret,
            code=code,
            redirect_uri=settings.slack_redirect_uri,
        )

        logger.debug(oauth_response)
        access_token = oauth_response.get("authed_user")["access_token"]
        slack_id_token = oauth_response.get("authed_user")["id"]

        return jwt_encode(client_id=slack_id_token, at_hash=encrypt(access_token))

    @AsyncTTL(time_to_live=60 * 60 * 12)
    async def verify_access_token(self, token: str) -> bool:
        """
        Verifies Slack access token. Values are cached so as to not query Slack servers
        too often.
        """
        try:
            test_response = await self.client.openid_connect_userInfo(token=token)

        except SlackApiError as err:
            logger.warning(err)
            return False

        else:
            logger.debug(f"testing token, response: {test_response}")

            if not test_response["ok"]:
                logger.warning(f"auth test response failed: {test_response}")
                return False

            if test_response["https://slack.com/team_id"] != "T1FB2571R":
                logger.warning(
                    f"auth test failed, wrong team: {test_response["team_id"]}"
                )
                return False

            return True

    async def test_token(self, token: str) -> bool:
        """
        Return True if token is authed, False otherwise.
        Raises TypeError if token is not string, and ValueError on otherwise malformed tokens.
        """
        # raises jwt errors on incorrect sign, expiration, wrong issuer etc
        decoded = jwt_decode(token=token)

        # decrypt() raises TypeError/ValueError on incorrect tokens
        decrypted = decrypt(decoded["at_hash"])

        # returns (cached) True/False
        return self.verify_access_token(decrypted)


slack_client = Slack()
