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
async def insert_task(task: models.TaskModel):
    """
    Insert one task into the database.
    """
    task_dict = task.model_dump()
    task_dict.update(
        {"created": arrow.utcnow().datetime, "modified": arrow.utcnow().datetime}
    )
    await collection.insert_one(task_dict)


async def query(id: str | None = None) -> list[models.TaskModel]:
    """
    Queries the database for (all the) tasks.
    """
    query = {}

    if id is not None:
        query.update({"_id": ObjectId(id)})

    cursor = collection.find(query)
    tasks = await cursor.to_list(None)
    return [models.TaskModel(**task) for task in tasks]


async def delete(id: str):
    logger.debug(f"Deleting task {id}.")
    await collection.delete_one({"_id": ObjectId(id)})
