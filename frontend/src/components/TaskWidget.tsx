import SlackIcon from "../assets/SlackIcon";
import Channel from "../types/Channel";
import { Task } from "../types/Task";
import User from "../types/User";
import { DateTime } from "ts-luxon";

export default function TaskWidget({
  task,
  users,
  channels,
}: {
  task: Task;
  users: User[];
  channels: Channel[];
}) {
  const author = users.find((user) => user.id === task.author);
  const channel = channels.find((channel) => channel.id === task.channel);
  const created = DateTime.fromISO(task.created);

  return (
    <div className="task widget">
      <div className="task-description">{task.description}</div>
      <div className="task-author" style={{ color: `#${author?.color}` }}>
        {author?.profile.display_name || author?.name || task.author}
      </div>
      <div className="task-status">{task.status}</div>
      <div className="task-created">{created.toLocaleString()}</div>
      <div className="task-priority">{task.priority}</div>
      <div className="task-votes">{task.votes.length}</div>
      <div className="task-channel">
        {task.channel} + {channel?.name}
      </div>
      <div className="task-slack">
        <a
          href={`https://tietoa.slack.com/archives/${task.channel}/p${task.ts}`}
        >
          <SlackIcon />
        </a>
      </div>
    </div>
  );
}
