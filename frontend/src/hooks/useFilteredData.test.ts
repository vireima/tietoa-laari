import { DateTime } from "ts-luxon";
import { ExtendedTask } from "../types/Task";
import { filterTasks } from "./useFilteredData";
import { statuses } from "../types/Status";
import { expect, test } from "vitest";
import { Filter } from "../types/Filter";
import User from "../types/User";

// export interface ExtendedTask {
//     author?: User;
//     assignee?: User;
//     assignees: (User | undefined)[];
//     channel?: Channel;
//     created: DateTime;
//     modified: DateTime;
//     description: string;
//     priority: number;
//     status: ExtendedStatus;
//     ts: string;
//     votes: OutputVote[];
//     tags: string[];
//     slite?: string;
//     archived: boolean;
//     _id: string;
//   }

const user1: User = {
  id: "U1",
  name: "U1",
  color: "FF0000",
  deleted: false,
  updated: 1,
  is_bot: false,
  profile: {
    real_name: "U1",
    display_name: "U1",
    status_emoji: "",
    status_text: "",
    image_32: "",
    image_512: "",
  },
};

const user2: User = {
  id: "U2",
  name: "U2",
  color: "FF0000",
  deleted: false,
  updated: 1,
  is_bot: false,
  profile: {
    real_name: "U2",
    display_name: "U2",
    status_emoji: "",
    status_text: "",
    image_32: "",
    image_512: "",
  },
};

const tasks: ExtendedTask[] = [
  {
    archived: false,
    created: DateTime.fromISO("2024-01-01T08:00+02:00"),
    modified: DateTime.fromISO("2024-01-01T08:00+02:00"),
    author: user1,
    channel: {
      id: "A",
      name: "A",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      user: undefined,
    },
    ts: "01",
    assignees: [],
    description: "",
    priority: 0,
    votes: [],
    tags: [],
    status: statuses[0],
    _id: "A",
  },
  {
    archived: false,
    created: DateTime.fromISO("2024-01-01T08:00+02:00"),
    modified: DateTime.fromISO("2024-01-01T08:00+02:00"),
    channel: {
      id: "B",
      name: "B",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      user: undefined,
    },
    ts: "02",
    assignees: [user1, user2],
    description: "",
    priority: 1,
    votes: [],
    tags: ["TIE"],
    status: statuses[1],
    _id: "B",
  },
  {
    archived: true,
    created: DateTime.fromISO("2024-01-01T08:00+02:00"),
    modified: DateTime.fromISO("2024-01-01T08:00+02:00"),
    channel: {
      id: "B",
      name: "B",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      user: undefined,
    },
    ts: "03",
    assignees: [],
    description: "",
    priority: 0,
    votes: [],
    tags: [],
    status: statuses[0],
    _id: "C",
  },
  {
    archived: false,
    created: DateTime.fromISO("2024-03-01T08:00+02:00"),
    modified: DateTime.fromISO("2024-03-01T08:00+02:00"),
    channel: {
      id: "B",
      name: "B",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      user: undefined,
    },
    ts: "04",
    assignees: [user2],
    description: "",
    priority: 0,
    votes: [],
    tags: ["TIE", "HAV"],
    status: statuses[2],
    _id: "D",
  },
];

const NOT_ARCHIVED = 3;

test("empty filter does no filtering", () => {
  const filter = {};

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(NOT_ARCHIVED);
});

test("empty channel filter does no filtering", () => {
  const filter: Filter = { channel: [] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(NOT_ARCHIVED);
});

test("filtering by a single channel", () => {
  const filter: Filter = { channel: ["A"] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
});

test("filtering by multiple channels", () => {
  const filter: Filter = { channel: ["A", "B"] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(NOT_ARCHIVED);
});

test("filtering by archived", () => {
  const filter: Filter = { archived: true };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
});

test("filtering by a single status", () => {
  const filter: Filter = { status: ["todo"] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
  expect(filtered[0].status.status === "todo");
});

test("filtering by multiple statuses", () => {
  const filter: Filter = { status: ["todo", "in progress"] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(2);
});

test("filtering by author", () => {
  const filter: Filter = { author: [user1.id] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
  expect(filtered[0].author?.id).toBe(user1.id);
});

test("filtering by a single assignee", () => {
  const filter: Filter = { assignees: [user1.id] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
});

test("filtering by two assignees", () => {
  const filter: Filter = { assignees: [user1.id, user2.id] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(2);
});

test("filtering by priority", () => {
  const filter: Filter = { priority: 1 };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
});

test("filtering by created", () => {
  const filter: Filter = { after: DateTime.fromISO("2024-02-20") };

  console.log(filter.after);
  console.log(tasks.map((t) => t.created));

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
});

test("filtering by a single tag", () => {
  const filter: Filter = { tags: ["TIE"] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(2);
});

test("filtering by multiple tags", () => {
  const filter: Filter = { tags: ["TIE", "HAV"] };

  const filtered = filterTasks(tasks, filter);

  expect(filtered.length).toBe(1);
});
