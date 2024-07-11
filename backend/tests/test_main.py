from unittest.mock import AsyncMock

import pytest
from fastapi import status
from fastapi.testclient import TestClient

import backend.main
from backend.config import settings

settings.mongo_db = "testing"


client = TestClient(backend.main.app)


@pytest.fixture
def outer_payload():
    return {
        "type": "event_callback",
        "event_id": "1",
        "event_time": 1,
        "token": "A",
        "team_id": "a",
        "api_app_id": "001",
    }


@pytest.fixture
def message_payload(outer_payload):
    outer_payload["event"] = {
        "type": "message",
        "channel": "C123ABC456",
        "user": "U123ABC456",
        "text": "Hello world",
        "ts": "1355517523.000005",
        "team": "aa",
        "event_ts": "1",
        "channel_type": "group",
    }
    return outer_payload


@pytest.fixture
def message_changed_payload(outer_payload):
    outer_payload["event"] = {
        "type": "message",
        "subtype": "message_changed",
        "hidden": True,
        "channel": "C123ABC456",
        "ts": "1358878755.000001",
        "event_ts": "1",
        "channel_type": "group",
        "message": {
            "type": "message",
            "user": "U123ABC456",
            "text": "Hello, world!",
            "ts": "1355517523.000005",
            "edited": {"user": "U123ABC456", "ts": "1358878755.000001"},
        },
        "previous_message": {
            "type": "message",
            "user": "U123ABC456",
            "text": "Hello, world!",
            "ts": "1355517523.000005",
            "edited": {"user": "U123ABC456", "ts": "1358878755.000001"},
        },
    }

    return outer_payload


def test_root():
    res = client.get("/")
    assert res.status_code == status.HTTP_200_OK


def test_process():
    res = client.post("/event", json={"type": "malformed"})
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_message_event(mocker, message_payload):
    insert_task = mocker.patch("backend.database.db.insert_task", AsyncMock())
    update_slite = mocker.patch("backend.main.update_slite", AsyncMock())
    res = client.post("/event", json=message_payload)
    assert res.status_code == status.HTTP_200_OK
    insert_task.assert_called_once()
    update_slite.assert_called_once()


def test_message_changed_event(mocker, message_changed_payload):
    update_task = mocker.patch("backend.database.db.update_task", AsyncMock())
    update_slite = mocker.patch("backend.main.update_slite", AsyncMock())
    res = client.post("/event", json=message_changed_payload)
    assert res.status_code == status.HTTP_200_OK
    update_task.assert_called_once()
    update_slite.assert_called_once()
