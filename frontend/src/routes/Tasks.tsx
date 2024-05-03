import { useLoaderData } from "react-router-dom";
import { Task } from "../types/Task";
import TaskWidget from "../components/TaskWidget";
import User from "../types/User";
import "../styles/task.css";
import Channel from "../types/Channel";

function Tasks() {
  const { tasks, users, channels } = useLoaderData() as {
    tasks: Task[];
    users: User[];
    channels: Channel[];
  };

  console.log(tasks);

  return (
    <>
      <div>List of tasks</div>
      <div className="tasks">
        {tasks.map((element) => (
          <TaskWidget
            task={element}
            users={users}
            channels={channels}
            key={element._id}
          />
        ))}
      </div>
    </>
  );
}

export default Tasks;
