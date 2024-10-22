// "/tasks/{channel}/{ts}/comments"

import axios from "axios";
import { ExtendedTask } from "../types/Task";
import { InputComment } from "../types/Comment";
import config from "../config";
import useAuth from "../hooks/useAuth";

export default async function getTasks(task: ExtendedTask) {
  if (!task.channel) return [];

  const response = await axios.get(
    `https://${config.API_URL}/tasks/${task.channel.id}/${task.ts}/comments`,
    { headers: { Authorization: `Bearer: ${useAuth()}` } }
  );
  return response.data as InputComment[];
}
