import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import getChannels from "../api/getChannels";
import getTasks from "../api/getTasks";
import getUsers from "../api/getUsers";
import { DateTime } from "ts-luxon";
import { Task } from "../types/Task";

function filterTasksByPriority(
  tasks: Task[] | undefined,
  priority: number | null
) {
  if (!tasks) return undefined;
  return priority ? tasks.filter((task) => task.priority >= priority) : tasks;
}

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

// Sorting
function cmpCreated(a: Task, b: Task) {
  return (
    DateTime.fromISO(b.created).toSeconds() -
    DateTime.fromISO(a.created).toSeconds()
  );
}

function cmpModified(a: Task, b: Task) {
  return (
    DateTime.fromISO(b.modified).toSeconds() -
    DateTime.fromISO(a.modified).toSeconds()
  );
}

function cmpChannel(a: Task, b: Task) {
  return a.channel.localeCompare(b.channel);
}

function cmpAuthor(a: Task, b: Task) {
  return a.author.localeCompare(b.author);
}

function cmpAssignee(a: Task, b: Task) {
  if (!a.assignee && !b.assignee) return 0;
  if (!a.assignee) return -1;
  if (!b.assignee) return 1;
  return a.assignee.localeCompare(b.assignee);
}

function cmpPriority(a: Task, b: Task) {
  return b.priority - a.priority;
}

function cmpVotes(a: Task, b: Task) {
  return b.votes.length - a.votes.length;
}

export default function useFilteredData() {
  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const channelsQuery = useQuery({
    queryKey: ["channels", tasksQuery.data],
    queryFn: () => getChannels(tasksQuery.data),
    enabled: !!usersQuery.data,
  });

  const [searchParams] = useSearchParams();

  const channels = searchParams.getAll("channel");
  const authors = searchParams.getAll("author");
  const assignees = searchParams.getAll("assignee");
  const after = searchParams.get("after");
  const priority = searchParams.get("priority");

  const filteredTasks = filterTasksByPriority(
    filterTasksByDate(
      filterTasksByAssignee(
        filterTasksByAuthor(
          filterTasksByChannel(tasksQuery.data, channels),
          authors
        ),
        assignees
      ),
      after
    ),
    Number(priority)
  );

  const cmpMap = new Map([
    ["created", cmpCreated],
    ["modified", cmpModified],
    ["channel", cmpChannel],
    ["author", cmpAuthor],
    ["assignee", cmpAssignee],
    ["priority", cmpPriority],
    ["votes", cmpVotes],
  ]);

  const sort = searchParams.getAll("sort");
  if (sort && sort.length) {
    // Main sorting logic
    const cmpArray = sort.map((sortingParamName) =>
      cmpMap.get(sortingParamName)
    );

    filteredTasks?.sort((a, b) => {
      for (const f of cmpArray) {
        if (!f) continue;
        const r = f(a, b);
        if (r != 0) return r;
      }
      return 0;
    });
  }

  return { filteredTasks, tasksQuery, usersQuery, channelsQuery };
}
