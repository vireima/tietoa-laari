import { Table } from "@mantine/core";
import { ExtendedTask, TaskWithVisualOverrides } from "../types/Task";
import TasklistItem from "./TasklistItem";

interface TasklistItemsProps {
  tasks: TaskWithVisualOverrides[];
  onOpen: (task: ExtendedTask) => void;
}

export default function TasklistItems({ tasks, onOpen }: TasklistItemsProps) {
  return (
    <Table.Tbody>
      {tasks.map((task) => (
        <TasklistItem
          key={task._id}
          task={task}
          selected={false}
          // opened={opened === task._id}
          onOpen={onOpen}
        />
      ))}
    </Table.Tbody>
  );
}
