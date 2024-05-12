import axios from "axios";
import { Task } from "../types/Task";

export default async function getTasks() {
  const response = await axios.get("https://laari.up.railway.app/tasks");
  return response.data as Task[];
}
