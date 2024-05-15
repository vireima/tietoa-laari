import User from "./User";

export interface InputComment {
  user: string;
  ts: string;
  thread_ts: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  text: string;
}

export interface ExtendedComment {
  user?: User;
  ts: string;
  thread_ts: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  text: string;
}
