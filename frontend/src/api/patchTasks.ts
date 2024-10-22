import axios from "axios";
import { ExtendedTask, InputTask } from "../types/Task";
import config from "../config";
import useAuth from "../hooks/useAuth";

export default async function patchTasks(tasks: ExtendedTask[]) {
  const payload = tasks.map((task) => ({
    ...task,
    description: task.description,
    author: task.author?.id,
    assignees: task.assignees.map((assignee) => assignee?.id),
    channel: task.channel?.id,
    created: task.created.toJSDate(),
    modified: task.modified.toJSDate(),
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

export async function patchPartialTasks(
  tasks: Partial<ExtendedTask>[],
  auth: string | null
) {
  const payload = tasks.map((task) => ({
    ...task,
    description: task.description,
    author: task.author?.id,
    assignees: task.assignees?.map((assignee) => assignee?.id),
    channel: task.channel?.id,
    created: task.created?.toJSDate(),
    modified: task.modified?.toJSDate(),
    status: task.status?.status,
    votes: task.votes?.map((vote) => ({
      reaction: vote.reaction,
      user: vote.user?.id,
    })),
  }));

  console.log("Sending payload", payload);
  const response = await axios.patch(
    `https://${config.API_URL}/tasks`,
    payload,
    { headers: { Authorization: `Bearer ${auth}` } }
  );
  console.log("Got response", response);
  return response.data as InputTask[];
}
