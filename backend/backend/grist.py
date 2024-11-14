import httpx
from cachetools.func import ttl_cache

from backend.config import settings
from backend.models import GristUserModel


@ttl_cache(maxsize=None, ttl=15 * 60)
def fetch_users() -> list[GristUserModel]:
    headers = {"Authorization": f"Bearer {settings.grist_api_key}"}

    api_url = f"{settings.grist_api_url}/docs/{settings.grist_user_doc_id}/tables/{settings.grist_user_table_id}/records"

    with httpx.Client(http2=True) as client:
        response = client.get(
            api_url,
            headers=headers,
        )

        lst = [x["fields"] for x in response.json()["records"]]

        return [GristUserModel(**x) for x in lst]


def get_user_by_id(slack_id: str) -> GristUserModel | None:
    """
    Find Grist user by Slack ID, or return None if no match found.
    """
    for user in fetch_users():
        if user.slack_id == slack_id:
            return user

    return None
