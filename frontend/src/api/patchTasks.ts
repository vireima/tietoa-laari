import axios from "axios";
import { Task } from "../types/Task";

export default async function patchTasks(tasks: Task[]) {
  const response = await axios.patch(
    "https://laari.up.railway.app/tasks",
    tasks
  );
  return response.data as Task[];
}
