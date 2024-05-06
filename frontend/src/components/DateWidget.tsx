import { DateTime } from "ts-luxon";

export default function StatusWidget({
  date,
  title,
}: {
  date: DateTime;
  title: string;
}) {
  return (
    <div className="task-created task-settings-line" title={title}>
      {date.toLocaleString()}
    </div>
  );
}
