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
  assignee: string | undefined;
  channel: string;
  created: string;
  modified: string;
  description: string;
  priority: number;
  status: Status;
  ts: string;
  votes: InputVote[];
  tags: string[];
  _id: string;
}

export interface ExtendedTask {
  author?: User;
  assignee?: User;
  channel?: Channel;
  created: DateTime;
  modified: DateTime;
  description: string;
  priority: number;
  status: ExtendedStatus;
  ts: string;
  votes: OutputVote[];
  tags: string[];
  _id: string;
}
