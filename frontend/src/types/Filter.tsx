import { DateTime } from "ts-luxon";
import { Status } from "./Status";

export interface Filter {
  status?: Status[];
  channel?: string[];
  after?: DateTime;
  author?: string[];
  assignees?: string[];
  priority?: number;
  votes?: number;
  tags?: string[];
  archived?: boolean;
}
