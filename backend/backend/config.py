from pydantic import Field, MongoDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_url: MongoDsn
    mongo_db: str = Field(min_length=3)
    mongo_collection: str = Field(min_length=3)
    # api_url: AnyHttpUrl
    # grist_api_url: AnyHttpUrl
    # grist_api_key: str
    # grist_api_userdoc: str
    # grist_api_usertable: str
    slack_bot_token: str
    slack_client_id: str
    slack_client_secret: str
    slack_redirect_uri: str
    slite_api_key: str
    slite_note_id: str
    frontend_url: str
    grist_api_url: str
    grist_api_key: str
    grist_user_doc_id: str
    grist_user_table_id: str
    fernet_key: bytes
    rsa_pem_private_key: str
    rsa_pem_public_key: str

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="allow"
    )


settings = Settings()  # pyright: ignore [reportCallIssue]
