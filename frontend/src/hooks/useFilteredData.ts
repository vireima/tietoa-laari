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

function filterTasks(tasks: ExtendedTask[], filter: Filter) {
  return tasks?.filter(
    (task) =>
      !!filter.status &&
      filter.status.length >= 1 &&
      filter.status.includes(task.status.status) &&
      !!filter.priority &&
      task.priority >= filter.priority &&
      (!filter.channel?.length ||
        (!!filter.channel &&
          filter.channel.length >= 1 &&
          task.channel &&
          filter.channel.includes(task.channel.id))) &&
      (!filter.author?.length ||
        (!!filter.author &&
          filter.author.length >= 1 &&
          task.author &&
          filter.author.includes(task.author.id))) &&
      (!filter.assignee?.length ||
        (!!filter.assignee &&
          filter.assignee.length >= 1 &&
          !!task.assignee &&
          filter.assignee.includes(task.assignee.id))) &&
      !!filter.after &&
      task.created >= filter.after &&
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

function cmpAssignee(a: ExtendedTask, b: ExtendedTask) {
  if (!a.assignee && !b.assignee) return 0;
  if (!a.assignee) return -1;
  if (!b.assignee) return 1;
  return userDisplayName(a.assignee).localeCompare(userDisplayName(b.assignee));
}

function cmpPriority(a: ExtendedTask, b: ExtendedTask) {
  return b.priority - a.priority;
}

function cmpVotes(a: ExtendedTask, b: ExtendedTask) {
  return b.votes.length - a.votes.length;
}

function inputToExtendedTasks(
  tasks: InputTask[] | undefined,
  channels: Channel[] | undefined,
  users: User[] | undefined
) {
  if (tasks) {
    const channelsMap = new Map(
      channels && channels.map((channel) => [channel.id, channel])
    );
    const usersMap = new Map(users && users.map((user) => [user.id, user]));

    return tasks.map((task) => {
      return {
        ...task,
        author: usersMap.get(task.author),
        assignee: task.assignee && usersMap.get(task.assignee),
        assignees: task.assignees.map((assignee) => {
          return usersMap.get(assignee);
        }),
        channel: channelsMap.get(task.channel) || { id: task.channel },
        created: DateTime.fromISO(task.created).setLocale("fi-FI"),
        modified: DateTime.fromISO(task.modified).setLocale("fi-FI"),
        status: statuses.find((s) => s.status === task.status),
        votes: task.votes.map((vote) => {
          return <OutputVote>{
            reaction: convertEmoji(`:${vote.reaction}:`),
            user: usersMap.get(vote.user),
          };
        }),
      } as ExtendedTask;
    });
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

  return { tasks: filteredTasks, tasksQuery, usersQuery, channelsQuery };
}
