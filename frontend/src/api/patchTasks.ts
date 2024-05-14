import axios from "axios";
import { InputTask } from "../types/Task";

export default async function patchTasks(tasks: InputTask[]) {
  const response = await axios.patch(
    "https://laari.up.railway.app/tasks",
    tasks
  );
  return response.data as InputTask[];
}
