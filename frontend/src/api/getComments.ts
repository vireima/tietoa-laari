// "/tasks/{channel}/{ts}/comments"

import axios from "axios";
import { ExtendedTask } from "../types/Task";
import config from "../config";

export default async function getTasks(task: ExtendedTask) {
  const response = await axios.get(
    `https://${config.API_URL}/tasks/${task.channel}/${task.ts}/comments`
  );
  return response.data;
}
