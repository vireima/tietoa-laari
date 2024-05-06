import { LoaderFunctionArgs } from "react-router-dom";

import axios from "axios";

import { Task } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";

async function loadChannels(tasks: Task[]): Promise<Channel[]> {
  const channels = Array.from(new Set(tasks.map((task) => task.channel)));
  return await Promise.all(
    channels.map((channel) =>
      axios
        .get(`https://laari.up.railway.app/channels/${channel}`)
        .then((response) => response.data)
    )
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function tasksLoader({ params }: LoaderFunctionArgs) {
  const [tasks, users]: [Task[], User[]] = await Promise.all([
    axios
      .get("https://laari.up.railway.app/tasks")
      .then((response) => response.data),
    axios
      .get("https://laari.up.railway.app/users")
      .then((response) => response.data),
  ]);
  const channels = await loadChannels(tasks);
  console.log("channels", channels);
  return { tasks, users, channels };
}

export type TasksLoaderResponse = Awaited<ReturnType<typeof tasksLoader>>;
