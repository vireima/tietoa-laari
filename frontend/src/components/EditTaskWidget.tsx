import { useSetState } from "@mantine/hooks";
import { Task } from "../types/Task";
import { Button, Group, Select, Stack, Textarea } from "@mantine/core";
import { Status } from "../types/Status";

export default function EditTaskWidget({
  initialTask,
  onSave,
  onCancel,
}: {
  initialTask: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}) {
  const [editedTask, editTask] = useSetState(initialTask);

  return (
    <Stack>
      <Textarea
        label="Kuvaus"
        value={editedTask.description}
        onChange={(event) =>
          editTask({ description: event.currentTarget.value })
        }
      />
      <Select
        label="Status"
        value={editedTask.status}
        onChange={(status) => editTask({ status: status as Status })}
        variant="unstyled"
        data={["todo", "in progress", "done", "closed"]}
      />
      <Group>
        <Button onClick={() => onSave(editedTask)}>Tallenna</Button>
        <Button color="red" onClick={() => onCancel()}>
          X
        </Button>
      </Group>
    </Stack>
  );
}
