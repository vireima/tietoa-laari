import { useSearchParams } from "react-router-dom";
import { userDisplayName } from "../api/getUsers";
import { DateTime } from "ts-luxon";
import { ExtendedTask, InputTask, OutputVote } from "../types/Task";
import Channel from "../types/Channel";
import User from "../types/User";
import convertEmoji from "../api/convertEmoji";
import { statuses } from "../types/Status";
import { Filter } from "../types/Filter";
import useFilters from "./useFilters";
import useQueries from "./useQueries";

const isUser = (user: User | undefined): user is User => {
  return !!user;
};

export function filterTasks(tasks: ExtendedTask[], filter: Filter) {
  return tasks.filter(
    (task) =>
      (!filter.status?.length ||
        (!!filter.status &&
          filter.status.length >= 1 &&
          filter.status.includes(task.status.status))) &&
      (!filter.channel?.length ||
        (!!filter.channel &&
          filter.channel.length >= 1 &&
          task.channel &&
          filter.channel.includes(task.channel.id))) &&
      !!filter.archived === task.archived &&
      (!filter.author?.length ||
        (!!filter.author &&
          filter.author.length >= 1 &&
          task.author &&
          filter.author.includes(task.author.id))) &&
      (!filter.assignees?.length ||
        (!!filter.assignees &&
          filter.assignees.length >= 1 &&
          !!task.assignees &&
          filter.assignees.some((assignee) =>
            task.assignees
              .filter(isUser)
              .map((a) => a.id)
              .includes(assignee)
          ))) &&
      (!filter.after || task.created >= filter.after) &&
      (!filter.priority || task.priority >= filter.priority) &&
      (!filter.tags?.length ||
        (!!filter.tags &&
          filter.tags.length >= 1 &&
          filter.tags.every((tag) => task.tags.includes(tag))))
  );
}

// Sorting
function cmpCreated(a: ExtendedTask, b: ExtendedTask) {
  return b.created.toSeconds() - a.created.toSeconds();
}

function cmpModified(a: ExtendedTask, b: ExtendedTask) {
  return b.modified.toSeconds() - a.modified.toSeconds();
}

function cmpChannel(a: ExtendedTask, b: ExtendedTask) {
  if (!a.channel?.name && !b.channel?.name)
    return a.channel?.user && b.channel?.user
      ? a.channel.user.localeCompare(b.channel.user)
      : 0;
  if (!a.channel?.name) return -1;
  if (!b.channel?.name) return 1;
  return a.channel.name.localeCompare(b.channel.name);
}

function cmpAuthor(a: ExtendedTask, b: ExtendedTask) {
  return userDisplayName(a.author).localeCompare(userDisplayName(b.author));
}

function cmpAssignees(a: ExtendedTask, b: ExtendedTask) {
  return b.assignees.length - a.assignees.length;
}

// function cmpAssignee(a: ExtendedTask, b: ExtendedTask) {
//   if (!a.assignee && !b.assignee) return 0;
//   if (!a.assignee) return -1;
//   if (!b.assignee) return 1;
//   return userDisplayName(a.assignee).localeCompare(userDisplayName(b.assignee));
// }

function cmpPriority(a: ExtendedTask, b: ExtendedTask) {
  return b.priority - a.priority;
}

function cmpVotes(a: ExtendedTask, b: ExtendedTask) {
  return b.votes.length - a.votes.length;
}

export function extendTask(
  task: InputTask,
  channels: Map<string, Channel>,
  users: Map<string, User>
): ExtendedTask {
  console.log("t", task);
  console.log("a", task.assignees);
  console.log("is", Array.isArray(task.assignees));

  return {
    ...task,
    author: users.get(task.author),
    assignees: task.assignees.map((assignee) => {
      return users.get(assignee);
    }),
    channel: channels.get(task.channel) || <Channel>{ id: task.channel },
    created: DateTime.fromISO(task.created).setLocale("fi-FI"),
    modified: DateTime.fromISO(task.modified).setLocale("fi-FI"),
    status: statuses.find((s) => s.status === task.status) || statuses[0],
    votes: task.votes.map((vote) => {
      return <OutputVote>{
        reaction: convertEmoji(`:${vote.reaction}:`),
        user: users.get(vote.user),
      };
    }),
  };
}

function inputToExtendedTasks(
  tasks: InputTask[] | undefined,
  channels: Channel[] | undefined,
  users: User[] | undefined
): ExtendedTask[] {
  if (tasks) {
    const channelsMap = new Map(
      channels && channels.map((channel) => [channel.id, channel])
    );
    const usersMap = new Map(users && users.map((user) => [user.id, user]));

    return tasks.map((task) => extendTask(task, channelsMap, usersMap));
  }

  return [];
}

export function useFilteredData(pathFilters?: Filter) {
  const { tasksQuery, usersQuery, channelsQuery } = useQueries();

  const [searchParams] = useSearchParams();
  const { filters } = useFilters(pathFilters ?? {});

  const extendedTasks = inputToExtendedTasks(
    tasksQuery.data,
    channelsQuery.data,
    usersQuery.data
  );

  const filteredTasks = filterTasks(extendedTasks, filters);

  const cmpMap = new Map([
    ["created", cmpCreated],
    ["modified", cmpModified],
    ["channel", cmpChannel],
    ["author", cmpAuthor],
    ["assignees", cmpAssignees],
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

  return { tasks: filteredTasks, tasksQuery, usersQuery, channelsQuery };
}
