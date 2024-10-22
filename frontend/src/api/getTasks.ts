import axios from "axios";
import { InputTask } from "../types/Task";
import config from "../config";
import useAuth from "../hooks/useAuth";

export default async function getTasks() {
  const response = await axios.get(
    `https://${config.API_URL}/tasks?include_archived=true`,
    { headers: { Authorization: `Bearer: ${useAuth()}` } }
  );
  return response.data as InputTask[];
}
