import Channel from "./Channel";
import { ExtendedStatus, Status } from "./Status";
import User from "./User";
import { DateTime } from "ts-luxon";

export interface InputVote {
  reaction: string;
  user: string;
}

export interface OutputVote {
  reaction: string;
  user: User | undefined;
}

export interface InputTask {
  author: string;
  // assignee: string | undefined;
  assignees: string[];
  channel: string;
  created: string;
  modified: string;
  description: string;
  priority: number;
  status: Status;
  ts: string;
  votes: InputVote[];
  tags: string[];
  slite: string | undefined;
  archived: boolean;
  teams: string[];
  _id: string;
}

export interface ExtendedTask {
  author?: User;
  // assignee?: User;
  assignees: (User | undefined)[];
  channel?: Channel;
  created: DateTime;
  modified: DateTime;
  description: string;
  priority: number;
  status: ExtendedStatus;
  ts: string;
  votes: OutputVote[];
  tags: string[];
  slite?: string;
  archived: boolean;
  teams: string[];
  _id: string;
}

export interface TaskWithVisualOverrides extends ExtendedTask {
  opened?: boolean;
  hidden?: boolean;
  faded?: boolean;
}
