import { Task } from "../types/Task";
import StatusIcon from "./StatusIcon";

export default function StatusWidget({
  task,
  editing,
}: {
  task: Task;
  editing: boolean;
}) {
  return (
    <div className="task-status task-settings-line" title="Status">
      <StatusIcon status={task.status} />
      <select
        name="status"
        id="status"
        defaultValue={task.status}
        disabled={!editing}
      >
        {["todo", "in progress", "done", "closed"].map((status) => (
          <option value={status} key={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
