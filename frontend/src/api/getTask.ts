import axios from "axios";
import { InputTask } from "../types/Task";
import config from "../config";

export default async function getTask(channel: string, ts: string) {
  const response = await axios.get(
    `https://${config.API_URL}/tasks/${channel}/${ts}`
  );
  return <InputTask>response.data[0];
}
