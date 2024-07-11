# pyright: reportRedeclaration=false

import datetime
import re

import arrow
from bson import ObjectId
from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient
from multimethod import multimethod
from pymongo import UpdateOne
from pymongo.results import BulkWriteResult

from backend import models
from backend.config import settings


class Database:
    def __init__(self, mongo_url: str, database: str, collection: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.database = self.client[database]
        self.collection = self.database[collection]

    @multimethod
    async def insert_task(self, message: models.InnerMessageEvent):
        """
        Insert one task into the database. Use Slack message as a task prototype.
        """
        slite = re.search(
            r"<https://tietoa\.slite\.com/api/s/(\w+)/?[^>]*>", message.text
        )

        await self.insert_task(
            models.TaskInputModel(
                author=message.user,
                assignees=re.findall(r"<@(\w+)>", message.text),
                channel=message.channel,
                ts=message.ts,
                description=message.text,
                created=datetime.datetime.now(models.TZ_UTC),
                modified=datetime.datetime.now(models.TZ_UTC),
                slite=None if slite is None else slite.group(1),
            )
        )

    @multimethod
    async def insert_task(self, task: models.TaskInputModel):  # noqa: F811
        """
        Insert one task into the database.
        """
        task_dict = task.model_dump()
        task_dict.update(
            {"created": arrow.utcnow().datetime, "modified": arrow.utcnow().datetime}
        )
        await self.collection.insert_one(task_dict)

    async def add_task_votes(self, vote: models.Reaction, channel: str, ts: str):
        """
        Add vote (an emoji reaction) to a task in the database.
        """
        logger.debug(f"ADDING {vote}")
        result = await self.collection.find_one_and_update(
            {"channel": channel, "ts": ts},
            {
                "$push": {
                    "votes": vote.model_dump(),
                },
                "$set": {"modified": datetime.datetime.now(models.TZ_UTC)},
            },
        )
        logger.warning(result)

    async def remove_task_votes(self, vote: models.Reaction, channel: str, ts: str):
        """
        Remove a vote (an emoji reaction) from a task.
        """
        logger.debug(f"REMOVING {vote}")
        result = await self.collection.find_one_and_update(
            {"channel": channel, "ts": ts},
            {
                "$pull": {"votes": vote.model_dump()},
                "$set": {"modified": datetime.datetime.now(models.TZ_UTC)},
            },
        )
        logger.warning(result)

    @multimethod
    async def query(
        self,
        task_id: str | None = None,
        ts: str | None = None,
        channel: str | None = None,
        include_archived: bool = False,
    ) -> list[models.TaskOutputModel]:
        """
        Queries the database for (all the) tasks.
        """
        query: dict[str, str | bool | ObjectId] = (
            {} if include_archived else {"archived": False}
        )

        if task_id is not None:
            query.update({"_id": ObjectId(task_id)})

        if ts is not None:
            query.update({"ts": ts})

        if channel is not None:
            query.update({"channel": channel})

        cursor = self.collection.find(query).sort("created", -1)
        tasks = await cursor.to_list(None)

        return [models.TaskOutputModel(**task) for task in tasks]

    @multimethod
    async def query(self, task_ids: list[str]):  # noqa: F811
        """
        Queries the database for all the tasks by _id.
        """
        query = {"_id": {"$in": [ObjectId(task_id) for task_id in task_ids]}}

        cursor = self.collection.find(query).sort("created", -1)
        tasks = await cursor.to_list(None)

        return [models.TaskOutputModel(**task) for task in tasks]

    @multimethod
    async def delete(self, task_id: str):
        """
        Delete a single task from the database by task id.
        """
        logger.debug(f"Deleting task {task_id}.")
        await self.collection.delete_one({"_id": ObjectId(task_id)})

    @multimethod
    async def delete(self, tasks: list[models.TaskUpdateModel]):  # noqa: F811
        """
        Delete multiple tasks from the database by task id.
        """
        await self.collection.delete_many(
            {"_id": {"$in": [ObjectId(task.id) for task in tasks]}}
        )

    async def patch(self, tasks: list[models.TaskUpdateModel]) -> BulkWriteResult:
        lst = [
            UpdateOne(
                {"_id": ObjectId(task.id)},
                {
                    "$set": task.model_dump(exclude_none=True)
                    | {"modified": datetime.datetime.now(models.TZ_UTC)}
                },
            )
            for task in tasks
        ]

        return await self.collection.bulk_write(lst)

    async def update_task(
        self, message: models.InnerMessageChangedEvent
    ) -> models.TaskOutputModel | None:
        logger.debug(
            f"Updating description: {message.previous_message.text} -> {message.message.text}"
        )

        result = await self.collection.find_one_and_update(
            {"channel": message.channel, "ts": message.message.ts},
            {
                "$set": {
                    "description": message.message.text,
                    "modified": datetime.datetime.now(models.TZ_UTC),
                }
            },
            return_document=True,
        )

        return models.TaskOutputModel(**result) if result else None

    async def duplicates(self, stringfy_ids=True):
        pipeline = [
            {
                "$group": {
                    "_id": {"channel": "$channel", "ts": "$ts"},
                    "tasks": {"$push": {"_id": "$_id", "created": "$created"}},
                    "count": {"$sum": 1},
                }
            },
            {"$match": {"count": {"$gt": 1}}},
        ]

        duplicates = await self.collection.aggregate(pipeline=pipeline).to_list(None)
        return purge_object_id(duplicates) if stringfy_ids else duplicates

    async def purge(self):
        """
        Removed duplicates (by channel + ts), leaves the first entry by 'created' datetime.
        """
        duplicates = await self.duplicates(stringfy_ids=False)

        ids_to_remove = []

        for group in duplicates:
            ids_to_remove.extend(
                [
                    task["_id"]
                    for task in sorted(group["tasks"], key=lambda x: x["created"])[1:]
                ]
            )

        logger.warning(f"Removing ids {ids_to_remove}...")

        result = await self.collection.delete_many({"_id": {"$in": ids_to_remove}})

        return {"deleted": result.deleted_count}


db = Database(str(settings.mongo_url), settings.mongo_db, settings.mongo_collection)


def purge_object_id(collection):
    if isinstance(collection, list):
        return [purge_object_id(item) for item in collection]
    elif isinstance(collection, dict):
        return {key: purge_object_id(value) for key, value in collection.items()}
    elif isinstance(collection, ObjectId):
        return str(collection)

    return collection
