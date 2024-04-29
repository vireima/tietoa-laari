# pyright: reportRedeclaration=false

import datetime

import arrow
from bson import ObjectId
from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient
from multimethod import multimethod

from backend import models
from backend.config import settings


class Database:
    def __init__(self, mongo_url: str, database: str, collection: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.database = self.client[database]
        self.collection = self.database[collection]

    @multimethod
    async def insert_task(self, message: models.MessageEventModel):
        """
        Insert one task into the database. Use Slack message as a task prototype.
        """
        await self.insert_task(
            models.TaskModel(
                author=message.event.user,
                channel=message.event.channel,
                ts=message.event.ts,
                description=message.event.text,
            )
        )

    @multimethod
    async def insert_task(self, task: models.TaskModel):  # noqa: F811
        """
        Insert one task into the database.
        """
        task_dict = task.model_dump()
        task_dict.update(
            {"created": arrow.utcnow().datetime, "modified": arrow.utcnow().datetime}
        )
        await self.collection.insert_one(task_dict)

    async def add_task_votes(self, vote: models.Reaction, channel: str, ts: str):
        logger.debug(f"ADDING {vote}")
        result = await self.collection.find_one_and_update(
            {"channel": channel, "ts": ts},
            {
                "$push": {
                    "votes": vote.model_dump(),
                    "$set": {"modified": datetime.datetime.now(models.TZ_UTC)},
                }
            },
        )
        logger.warning(result)

    async def remove_task_votes(self, vote: models.Reaction, channel: str, ts: str):
        logger.debug(f"REMOVING {vote}")
        result = await self.collection.find_one_and_update(
            {"channel": channel, "ts": ts},
            {
                "$pull": {"votes": vote.model_dump()},
                "$set": {"modified": datetime.datetime.now(models.TZ_UTC)},
            },
        )
        logger.warning(result)

    async def query(
        self,
        task_id: str | None = None,
        ts: str | None = None,
        channel: str | None = None,
    ) -> list[models.TaskModel]:
        """
        Queries the database for (all the) tasks.
        """
        query = {}

        if task_id is not None:
            query.update({"_id": ObjectId(task_id)})

        if ts is not None:
            query.update({"ts": ts})

        if channel is not None:
            query.update({"channel": channel})

        cursor = self.collection.find(query)
        tasks = await cursor.to_list(None)
        return [models.TaskModel(**task) for task in tasks]

    async def delete(self, task_id: str):
        """
        Delete a single task from the database by task id.
        """
        logger.debug(f"Deleting task {task_id}.")
        await self.collection.delete_one({"_id": ObjectId(task_id)})


db = Database(str(settings.mongo_url), settings.mongo_db, settings.mongo_collection)
