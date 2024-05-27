import axios from "axios";
import { ExtendedTask, InputTask } from "../types/Task";
import config from "../config";

export default async function patchTasks(tasks: ExtendedTask[]) {
  const payload = tasks.map((task) => ({
    ...task,
    author: task.author?.id,
    assignee: task.assignee?.id,
    assignees: task.assignees.map((assignee) => assignee?.id),
    channel: task.channel?.id,
    created: task.created.toJSDate(),
    modified: task.created.toJSDate(),
    status: task.status.status,
    votes: task.votes.map((vote) => ({
      reaction: vote.reaction,
      user: vote.user?.id,
    })),
  }));
  const response = await axios.patch(
    `https://${config.API_URL}/tasks`,
    payload
  );
  return response.data as InputTask[];
}
