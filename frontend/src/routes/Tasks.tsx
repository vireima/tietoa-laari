import { useLoaderData, useSearchParams } from "react-router-dom";
import { Task } from "../types/Task";
import TaskWidget from "../components/TaskWidget";
import "../styles/task.css";
import { DateTime } from "ts-luxon";
import { TasksLoaderResponse } from "../api/Tasks.loader";

function filterTasksByChannel(tasks: Task[], channel: string | null) {
  return channel ? tasks.filter((task) => task.channel === channel) : tasks;
}

function filterTasksByAuthor(tasks: Task[], author: string | null) {
  return author ? tasks.filter((task) => task.author === author) : tasks;
}

function filterTasksByAssignee(tasks: Task[], assignee: string | null) {
  return assignee ? tasks.filter((task) => task.assignee === assignee) : tasks;
}

function filterTasksByDate(tasks: Task[], after: string | null) {
  if (after === null) return tasks;
  const afterDate = DateTime.fromISO(after, { zone: "Europe/Helsinki" });
  console.log("afterDate", afterDate, afterDate.isValid);
  return afterDate.isValid
    ? tasks.filter((task) => DateTime.fromISO(task.created) >= afterDate)
    : tasks;
}

function Tasks() {
  const { tasks, users, channels } = useLoaderData() as TasksLoaderResponse;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const channel = searchParams.get("channel");
  const author = searchParams.get("author");
  const assignee = searchParams.get("assignee");
  const after = searchParams.get("after");

  const filteredTasks = filterTasksByDate(
    filterTasksByAssignee(
      filterTasksByAuthor(filterTasksByChannel(tasks, channel), author),
      assignee
    ),
    after
  );

  console.log(
    "Filtered",
    filteredTasks.length,
    "out of",
    tasks.length,
    "tasks"
  );

  return (
    <>
      {/* <div
        style={{
          backgroundColor: "#ffaaaa",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <p>
          Tavallista tekstiä <a href="#">ja linkki toisaalle.</a>
        </p>
        <button>Naviska</button>
        <div style={{ backgroundColor: "#aaaaff" }}>teksturs</div>
      </div> */}
      <div className="tasks">
        {filteredTasks.map((element) => (
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
