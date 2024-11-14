import axios from "axios";
import { InputTask } from "../types/Task";
import config from "../config";

export default async function getTask({ queryKey }: any) {
  const [_key, auth, channel, ts] = queryKey;

  const response = await axios.get(
    `https://${config.API_URL}/tasks/${channel}/${ts}`,
    { headers: { Authorization: `Bearer ${auth}` } }
  );
  return <InputTask>response.data[0];
}
