import { useLoaderData } from "react-router-dom";
import { Task } from "../types/Task";

function Tasks() {
  const tasks = useLoaderData() as Task[];

  return (
    <>
      <div>List of tasks</div>
      <div>
        <ul>
          {tasks.map((element) => (
            <li>{element.user}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Tasks;
