import { useSearchParams } from "react-router-dom";
import { Task } from "../types/Task";
import TaskWidget from "../components/TaskWidget";
import { DateTime } from "ts-luxon";
import { Loader, SimpleGrid } from "@mantine/core";
import useTasks from "../hooks/useTasks";
import useUsers from "../hooks/useUsers";
import useChannels from "../hooks/useChannels";

function filterTasksByChannel(tasks: Task[] | null, channel: string | null) {
  if (!tasks) return null;
  return channel ? tasks.filter((task) => task.channel === channel) : tasks;
}

function filterTasksByAuthor(tasks: Task[] | null, author: string | null) {
  if (!tasks) return null;
  return author ? tasks.filter((task) => task.author === author) : tasks;
}

function filterTasksByAssignee(tasks: Task[] | null, assignee: string | null) {
  if (!tasks) return null;
  return assignee ? tasks.filter((task) => task.assignee === assignee) : tasks;
}

function filterTasksByDate(tasks: Task[] | null, after: string | null) {
  if (after === null) return tasks;
  const afterDate = DateTime.fromISO(after, { zone: "Europe/Helsinki" });
  // console.log("afterDate", afterDate, afterDate.isValid);
  return afterDate.isValid
    ? tasks?.filter((task) => DateTime.fromISO(task.created) >= afterDate)
    : tasks;
}

function Tasks() {
  // const { tasks, users, channels } = useLoaderData() as TasksLoaderResponse;

  const { tasks, refetch: refetchTasks } = useTasks();
  const { users } = useUsers();
  const { channels } = useChannels(tasks);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams] = useSearchParams();

  const channel = searchParams.get("channel");
  const author = searchParams.get("author");
  const assignee = searchParams.get("assignee");
  const after = searchParams.get("after");

  console.log("tasks", tasks);
  // console.log("xUsers", xUsers.users);
  // console.log("xChannels", xChannels.channels);

  const filteredTasks = filterTasksByDate(
    filterTasksByAssignee(
      filterTasksByAuthor(filterTasksByChannel(tasks, channel), author),
      assignee
    ),
    after
  );

  // console.log(
  //   "Filtered",
  //   filteredTasks.length,
  //   "out of",
  //   tasks.length,
  //   "tasks"
  // );

  return (
    <>
      {!filteredTasks ? (
        <Loader />
      ) : (
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5 }} p={"2rem"}>
          {filteredTasks.map((element) => (
            <TaskWidget
              initialTask={element}
              users={users}
              channels={channels}
              key={element._id}
              onTaskChange={(task) => {
                console.log("refetch!", task._id);
                return refetchTasks();
              }}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}

export default Tasks;
