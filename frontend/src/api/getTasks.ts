import axios from "axios";
import { InputTask } from "../types/Task";
import config from "../config";

export default async function getTasks() {
  const response = await axios.get(`https://${config.API_URL}/tasks`);
  return response.data as InputTask[];
}
