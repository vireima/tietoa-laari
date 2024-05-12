import { useSearchParams } from "react-router-dom";
import { Task } from "../types/Task";
import TaskWidget from "../components/TaskWidget";
import { DateTime } from "ts-luxon";
import { Loader, SimpleGrid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import getChannels from "../api/getChannels";
import getTasks from "../api/getTasks";
import getUsers from "../api/getUsers";

function filterTasksByChannel(
  tasks: Task[] | undefined,
  channels: string[] | null
) {
  if (!tasks) return undefined;
  return channels && channels.length > 0
    ? tasks.filter((task) => channels.includes(task.channel))
    : tasks;
}

function filterTasksByAuthor(
  tasks: Task[] | undefined,
  authors: string[] | null
) {
  if (!tasks) return undefined;
  return authors && authors.length > 0
    ? tasks.filter((task) => authors.includes(task.author))
    : tasks;
}

function filterTasksByAssignee(
  tasks: Task[] | undefined,
  assignees: string[] | null
) {
  if (!tasks) return undefined;
  return assignees && assignees.length > 0
    ? tasks.filter((task) => task.assignee && assignees.includes(task.assignee))
    : tasks;
}

function filterTasksByDate(tasks: Task[] | undefined, after: string | null) {
  if (after === null) return tasks;
  const afterDate = DateTime.fromISO(after, { zone: "Europe/Helsinki" });
  return afterDate.isValid
    ? tasks?.filter((task) => DateTime.fromISO(task.created) >= afterDate)
    : tasks;
}

function Tasks() {
  // const { tasks, users, channels } = useOutletContext<TaskDataOutletContext>();

  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const channelsQuery = useQuery({
    queryKey: ["channels", tasksQuery.data],
    queryFn: () => getChannels(tasksQuery.data),
    enabled: !!usersQuery.data,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams] = useSearchParams();

  const channels = searchParams.getAll("channel");
  const authors = searchParams.getAll("author");
  const assignees = searchParams.getAll("assignee");
  const after = searchParams.get("after");

  const filteredTasks = filterTasksByDate(
    filterTasksByAssignee(
      filterTasksByAuthor(
        filterTasksByChannel(tasksQuery.data, channels),
        authors
      ),
      assignees
    ),
    after
  );

  // if (filteredTasks) {
  //   filteredTasks.sort(
  //     (a: Task, b: Task) =>
  //       DateTime.fromISO(b.modified).toSeconds() -
  //       DateTime.fromISO(a.modified).toSeconds()
  //   );
  // }

  return (
    <>
      {!filteredTasks ? (
        <Loader />
      ) : (
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5 }}
          p={{ base: "0.2rem", sm: "1rem", lg: "2rem" }}
          pt="4rem"
        >
          {filteredTasks.map((task) => (
            <TaskWidget
              initialTask={task}
              users={usersQuery.data}
              channels={channelsQuery.data}
              key={task._id}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}

export default Tasks;
