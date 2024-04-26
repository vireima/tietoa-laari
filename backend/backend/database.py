# pyright: reportRedeclaration=false

import arrow
from bson import ObjectId
from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient
from multimethod import multimethod

from backend import models
from backend.config import settings

client = AsyncIOMotorClient(str(settings.mongo_url))


database = client[settings.mongo_db]
collection = database[settings.mongo_collection]


@multimethod
async def insert_task(message: models.MessageEventModel):
    """
    Insert one task into the database. Use Slack message as a task prototype.
    """
    await insert_task(
        models.TaskModel(
            author=message.event.user,
            channel=message.event.channel,
            ts=message.event.ts,
            description=message.event.text,
        )
    )


@multimethod
async def insert_task(task: models.TaskModel):  # noqa: F811
    """
    Insert one task into the database.
    """
    task_dict = task.model_dump()
    task_dict.update(
        {"created": arrow.utcnow().datetime, "modified": arrow.utcnow().datetime}
    )
    await collection.insert_one(task_dict)


async def query(task_id: str | None = None) -> list[models.TaskModel]:
    """
    Queries the database for (all the) tasks.
    """
    query = {}

    if task_id is not None:
        query.update({"_id": ObjectId(task_id)})

    cursor = collection.find(query)
    tasks = await cursor.to_list(None)
    return [models.TaskModel(**task) for task in tasks]


async def delete(task_id: str):
    """
    Delete a single task from the database by task id.
    """
    logger.debug(f"Deleting task {task_id}.")
    await collection.delete_one({"_id": ObjectId(task_id)})
