from pydantic import AnyHttpUrl, MongoDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_url: MongoDsn
    mongo_db: str
    mongo_collection: str
    # api_url: AnyHttpUrl
    # grist_api_url: AnyHttpUrl
    # grist_api_key: str
    # grist_api_userdoc: str
    # grist_api_usertable: str
    slack_bot_token: str

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="allow"
    )


settings = Settings()
