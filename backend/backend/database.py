import arrow
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
    task_dict = task.model_dump()
    task_dict.update(
        {"created": arrow.utcnow().datetime, "modified": arrow.utcnow().datetime}
    )
    await collection.insert_one(task_dict)
