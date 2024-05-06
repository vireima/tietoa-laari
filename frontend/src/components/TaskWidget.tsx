import { Form } from "react-router-dom";
import Channel from "../types/Channel";
import { Task } from "../types/Task";
import User from "../types/User";
import { DateTime } from "ts-luxon";
import { useState } from "react";
import StatusIcon from "./StatusIcon";
import StatusWidget from "./StatusWidget";
import DateWidget from "./DateWidget";

export default function TaskWidget({
  task,
  users,
  channels,
}: {
  task: Task;
  users: User[];
  channels: Channel[];
}) {
  const [editing, setEditing] = useState(false);
  const author = users.find((user) => user.id === task.author);
  const assignee = users.find((user) => user.id === task.assignee);
  const channel = channels.find((channel) => channel.id === task.channel);
  const created = DateTime.fromISO(task.created);

  return (
    <div
      className="task widget"
      onClick={() => {
        setEditing(true);
      }}
    >
      <Form method="patch" onSubmit={() => setEditing(false)}>
        <input type="hidden" id="_id" name="_id" value={task._id} />
        <div className="task-description">
          <textarea
            id="description"
            name="description"
            defaultValue={task.description}
            disabled={!editing}
            onChange={(e) => {
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </div>
        <div
          className="task-author task-settings-line"
          style={{ color: `#${author?.color}` }}
          title="Ehdottanut"
        >
          {author?.profile.display_name || author?.name || task.author}
        </div>
        <div
          className="task-assignee task-settings-line"
          style={assignee ? { color: `#${assignee?.color}` } : undefined}
          title="Vastuullinen"
        >
          <select
            name="assignee"
            id="assignee"
            defaultValue={task.assignee || undefined}
            disabled={!editing}
            style={assignee ? { color: `#${assignee?.color}` } : undefined}
          >
            <option value={undefined}>--</option>
            {users.map((user) => (
              <option
                value={user.id}
                style={{ color: `#${user?.color}` }}
                key={user.id}
              >
                {user.profile.display_name || user.name}
              </option>
            ))}
          </select>
        </div>
        <StatusWidget task={task} editing={editing} />
        <DateWidget date={created} title="Ehdotettu" />

        <div className="task-priority task-settings-line" title="Prioriteetti">
          {task.priority}
        </div>
        <div className="task-votes task-settings-line" title="Ääniä">
          {task.votes.length}
        </div>
        <div className="task-channel task-settings-line" title="Slack-kanava">
          {channel !== undefined && (channel.is_channel || channel.is_group) ? (
            <a
              href={`https://tietoa.slack.com/archives/${task.channel}/p${task.ts}`}
            >
              {`#${channel.name}`}
            </a>
          ) : (
            channel?.user
          )}
        </div>
        <div>
          {editing ? (
            <button type="submit" disabled={!editing}>
              Save
            </button>
          ) : (
            <></>
          )}
        </div>
      </Form>
    </div>
  );
}
