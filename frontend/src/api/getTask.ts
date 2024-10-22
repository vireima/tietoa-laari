import axios from "axios";
import { InputTask } from "../types/Task";
import config from "../config";
import useAuth from "../hooks/useAuth";

export default async function getTask(channel: string, ts: string) {
  const response = await axios.get(
    `https://${config.API_URL}/tasks/${channel}/${ts}`,
    { headers: { Authorization: `Bearer ${useAuth()}` } }
  );
  return <InputTask>response.data[0];
}
