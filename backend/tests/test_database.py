from datetime import datetime

import motor.motor_asyncio
import pytest
import pytest_asyncio

from backend import models
from backend.config import settings
from backend.database import Database


@pytest_asyncio.fixture(scope="module")
async def database():
    db = Database(str(settings.mongo_url), "testing", settings.mongo_collection)
    yield db
    await db.collection.drop()


@pytest.mark.asyncio(scope="module")
async def test_insert_task(database: Database):
    message = models.InnerMessageEvent(
        user="user_id",
        channel="channel_id",
        ts="test_insert_task",
        text="Task description",
        type="message",
        team="team",
        event_ts="1",
        channel_type="group",
    )
    await database.insert_task(message)

    # Check if the task was inserted properly
    tasks = await database.query(channel="channel_id", ts="test_insert_task")
    assert len(tasks) == 1
    assert tasks[0].description == "Task description"


@pytest.mark.asyncio(scope="module")
async def test_update_task(database: Database):
    task = models.InnerMessageEvent(
        user="user_id",
        channel="channel_id",
        ts="test_update_task",
        text="Original task description",
        type="message",
        team="team",
        event_ts="1",
        channel_type="group",
    )

    await database.insert_task(task)

    update = models.InnerMessageChangedEvent(
        user="user_id",
        channel="channel_id",
        ts="test_update_task",
        type="message",
        subtype="message_changed",
        event_ts="1",
        channel_type="group",
        message=models.ChangedMessage(
            type="message", text="Changed task description", user="user_id", ts="new ts"
        ),
        previous_message=models.ChangedMessage(
            type="message",
            text="Original task description",
            user="user_id",
            ts="test_update_task",
        ),
    )

    updated_task = await database.update_task(update)

    assert updated_task is not None
    assert updated_task.description == "Changed task description"
    assert updated_task.author == "user_id"
    assert updated_task.modified > updated_task.created

    # Check if the task was inserted properly
    tasks = await database.query(channel="channel_id", ts="test_update_task")
    assert len(tasks) == 1
    assert tasks[0].description == "Changed task description"


@pytest.mark.asyncio(scope="module")
async def test_add_and_remove_task_votes(database: Database):
    task = models.TaskInputModel(
        author="user_id",
        channel="channel_id",
        ts="test_add_and_remove_task_votes",
        description="Task description",
        created=datetime.now(models.TZ_UTC),
        modified=datetime.now(models.TZ_UTC),
    )
    await database.insert_task(task)

    # Add a vote
    vote = models.Reaction(user="user_id", reaction="👍")
    await database.add_task_votes(
        vote, channel="channel_id", ts="test_add_and_remove_task_votes"
    )

    # Check if the vote was added
    tasks = await database.query(
        channel="channel_id", ts="test_add_and_remove_task_votes"
    )
    assert len(tasks[0].votes) == 1

    # Remove the vote
    await database.remove_task_votes(
        vote, channel="channel_id", ts="test_add_and_remove_task_votes"
    )

    # Check if the vote was removed
    tasks = await database.query(
        channel="channel_id", ts="test_add_and_remove_task_votes"
    )
    assert len(tasks[0].votes) == 0


@pytest.mark.asyncio(scope="module")
async def test_delete(database: Database):
    task = models.TaskInputModel(
        author="user_id",
        channel="channel_id",
        ts="test_delete",
        description="Task description",
        created=datetime.now(models.TZ_UTC),
        modified=datetime.now(models.TZ_UTC),
    )
    await database.insert_task(task)

    # Check if the task was inserted properly
    tasks = await database.query(channel="channel_id", ts="test_delete")
    assert len(tasks) == 1

    # Delete the task
    await database.delete(tasks[0].id)

    # Check if the task was deleted
    tasks = await database.query(channel="channel_id", ts="test_delete")
    assert len(tasks) == 0


@pytest.mark.asyncio(scope="module")
async def test_patch(database: Database):
    task = models.TaskInputModel(
        author="user_id",
        channel="channel_id",
        ts="test_patch",
        description="Task description",
        created=datetime.now(models.TZ_UTC),
        modified=datetime.now(models.TZ_UTC),
    )
    await database.insert_task(task)

    # Check if the task was inserted properly
    tasks = await database.query(channel="channel_id", ts="test_patch")
    assert len(tasks) == 1

    # Update the task
    updated_task = models.TaskUpdateModel(
        _id=tasks[0].id, description="Updated description"
    )
    await database.patch([updated_task])

    # Check if the task was updated properly
    tasks = await database.query(channel="channel_id", ts="test_patch")
    assert len(tasks) == 1
    assert tasks[0].description == "Updated description"
