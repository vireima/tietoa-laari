import { useSearchParams } from "react-router-dom";
import { ExtendedTask } from "../types/Task";
import { useListState } from "@mantine/hooks";

interface SortDirection {
  key: keyof ExtendedTask;
  reversed: boolean;
}

function cmpCreated(a: ExtendedTask, b: ExtendedTask) {
  return b.created.toSeconds() - a.created.toSeconds();
}

function cmpModified(a: ExtendedTask, b: ExtendedTask) {
  return b.modified.toSeconds() - a.modified.toSeconds();
}

function cmpStatus(a: ExtendedTask, b: ExtendedTask) {
  return b.status.number - a.status.number;
}

function cmpVotes(a: ExtendedTask, b: ExtendedTask) {
  return b.votes.length - a.votes.length;
}

function cmpDescription(a: ExtendedTask, b: ExtendedTask) {
  return a.description.localeCompare(b.description);
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

// function sortTasks(
//   tasks: ExtendedTask[],
//   cmp: (a: ExtendedTask, b: ExtendedTask) => number,
//   reversed: boolean
// ) {
//   tasks.sort((a, b) => {
//     if (reversed) return cmp(b, a);
//     return cmp(a, b);
//   });
// }

function reverseCmpFn(cmp: (a: ExtendedTask, b: ExtendedTask) => number) {
  return (a: ExtendedTask, b: ExtendedTask) => cmp(b, a);
}

function sortTasks(tasks: ExtendedTask[], sortDirections: SortDirection[]) {
  const cmpMap = new Map<keyof ExtendedTask, typeof cmpCreated>([
    ["created", cmpCreated],
    ["modified", cmpModified],
    ["status", cmpStatus],
    // ["author", cmpAuthor],
    // ["assignees", cmpAssignees],
    // ["priority", cmpPriority],
    ["votes", cmpVotes],
    ["description", cmpDescription],
    ["channel", cmpChannel],
  ]);

  // Iterate the array backwards
  sortDirections.findLast((dir) => {
    const cmp = cmpMap.get(dir.key);
    if (cmp) tasks.sort(dir.reversed ? reverseCmpFn(cmp) : cmp);
  });
}

export default function useSorted(data: ExtendedTask[]) {
  // const mm = new Array<{ key: keyof ExtendedTask; reversed: boolean }>();
  const [values, handlers] = useListState<SortDirection>([]);

  function setSorting(key: keyof ExtendedTask) {
    const index = values.findIndex((item) => item.key === key);
    // console.log("setSorting(): index =", index);

    if (index === -1) {
      // Sorting
      // console.log("not found, adding");
      handlers.prepend({ key: key, reversed: false });
    } else {
      // Removing sorting
      const rev = values[index].reversed;
      // console.log("found, rev: ", rev);
      handlers.remove(index);

      if (!rev) {
        // Reversing
        handlers.prepend({ key: key, reversed: true });
      }
    }
  }

  function isSorted(key: keyof ExtendedTask) {
    return values.findIndex((item) => item.key === key) !== -1;
  }

  function isReversed(key: keyof ExtendedTask) {
    const index = values.findIndex((item) => item.key === key);
    return index !== -1 && values[index].reversed;
  }

  // const [searchParams, setSearchParams] = useSearchParams();
  // setSearchParams({ sort: ["channel", "author"], reversed: ["true", "true"] });

  sortTasks(data, values);

  const tuple: [typeof isSorted, typeof isReversed, typeof setSorting] = [
    // sortTasks(data, values),
    isSorted,
    isReversed,
    setSorting,
  ];
  return tuple;
}

// sort
