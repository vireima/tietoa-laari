import { useLoaderData } from "react-router-dom";
import { Task } from "../types/Task";
import TaskWidget from "../components/TaskWidget";
import User from "../types/User";
import "../styles/task.css";

function Tasks() {
  const { tasks, users } = useLoaderData() as { tasks: Task[]; users: User[] };

  console.log(tasks);

  return (
    <>
      <div>List of tasks</div>
      <div className="tasks">
        {tasks.map((element) => (
          <TaskWidget task={element} users={users} key={element._id} />
        ))}
      </div>
    </>
  );
}

export default Tasks;
