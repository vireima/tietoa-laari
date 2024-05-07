import { Status } from "./Status";

interface Vote {
  reaction: string;
  user: string;
}

export interface Task {
  author: string;
  assignee: string | null;
  channel: string;
  created: string;
  modified: string;
  description: string;
  priority: number;
  status: Status;
  ts: string;
  votes: Vote[];
  _id: string;
}
