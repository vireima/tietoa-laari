// import "../styles/icon.css";
import InProgressIcon from "../assets/InProgressIcon";
import ClosedIcon from "../assets/ClosedIcon";
import TodoIcon from "../assets/TodoIcon";
import DoneIcon from "../assets/DoneIcon";

export default function StatusIcon({ status }: { status: string }) {
  const statusIconMapping = new Map([
    ["todo", <TodoIcon />],
    ["in progress", <InProgressIcon />],
    ["done", <DoneIcon />],
    ["closed", <ClosedIcon />],
  ]);

  return <>{statusIconMapping.get(status)}</>;
}
