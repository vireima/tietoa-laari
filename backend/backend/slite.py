import httpx

from backend.config import settings
from backend.models import SlackChannelModel, SlackUserModel, TaskOutputModel
from backend.slack import Slack


def format_channel(channel_id: str, channels: list[SlackChannelModel]) -> str:
    channel = next((ch for ch in channels if ch.id == channel_id), None)

    if not channel:
        return ""

    return f"#{channel.name}"


def format_user(user: str, users: list[SlackUserModel]) -> str:
    return next(
        (usr.profile.display_name for usr in users if usr.id == user), "<tyhjä>"
    )


def task_to_html(
    task: TaskOutputModel,
    channels: list[SlackChannelModel],
    users: list[SlackUserModel],
):
    channel = format_channel(task.channel, channels)
    author = format_user(task.author, users)
    # assignees

    return f"""<tr>
        <td>{task.description}</td>
        <td>{author}</td>
        <td>{channel}</td>
        <td>{task.created}</td>
        <td>{task.slite if task.slite else ""}</td>
        <td>{task.status.name}</td>
        <td>{len(task.votes)}</td>
        <td><a href='{f"https://{settings.frontend_url}/{task.channel}/{task.ts}"}'>Linkki</a></td>
        <td><a href='{f"https://tietoa.slack.com/archives/{task.channel}/p{task.ts}"}'>SLinkki</a></td>
    </tr>"""


def tasks_to_html(
    tasks: list[TaskOutputModel],
    channels: list[SlackChannelModel],
    users: list[SlackUserModel],
):
    return f"""<table>
        <tr>
            <th>Kuvaus</th>
            <th>Tekijä</th>
            <th>Kanava</th>
            <th>Aika</th>
            <th>Slite-linkki</th>
            <th>Status</th>
            <th>Slack-reaktioiden määrä</th>
            <th>Linkki</th>
            <th>Slack-linkki</th>
        </tr>
        {"".join(task_to_html(task, channels, users) for task in tasks)}
    </table>"""


async def make_slite_page(tasks: list[TaskOutputModel], client: Slack):
    channels = await client.channels()
    users = await client.users()

    html = tasks_to_html(tasks, channels, users)

    httpx.put(
        f"https://api.slite.com/v1/notes/{settings.slite_note_id}",
        headers={"x-slite-api-key": settings.slite_api_key},
        data={"html": html},
    )
