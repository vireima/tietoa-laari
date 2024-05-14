import axios from "axios";
import { ExtendedTask, InputTask } from "../types/Task";

export default async function patchTasks(tasks: ExtendedTask[]) {
  const payload = tasks.map((task) => ({
    ...task,
    author: task.author?.id,
    assignee: task.assignee?.id,
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
    "https://laari.up.railway.app/tasks",
    payload
  );
  return response.data as InputTask[];
}
