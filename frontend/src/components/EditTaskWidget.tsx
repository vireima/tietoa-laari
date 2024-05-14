import { useSetState } from "@mantine/hooks";
import { InputTask } from "../types/Task";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import StatusSelect from "./StatusSelect";
import { UsersSingleSelect } from "./UsersMultiSelect";
import User from "../types/User";

export default function EditTaskWidget({
  initialTask,
  onSave,
  users,
}: {
  initialTask: InputTask;
  onSave: (task: InputTask) => void;
  onCancel: () => void;
  users: User[] | undefined;
}) {
  const [editedTask, editTask] = useSetState(initialTask);

  return (
    <Stack>
      <Textarea
        label="Kuvaus"
        value={editedTask.description}
        minRows={5}
        autosize
        onChange={(event) =>
          editTask({ description: event.currentTarget.value })
        }
      />
      <UsersSingleSelect
        label="Vastuullinen tekijä"
        description="Rajaa ehdotuksia vastuullisen tekijän mukaan"
        onChange={(userID) => editTask({ assignee: userID })}
        value={editedTask.assignee}
        users={users}
      />
      <StatusSelect
        status={editedTask.status}
        onChange={(status) => editTask({ status: status })}
      />
      <Group>
        <Button variant="light" onClick={() => onSave(editedTask)}>
          Tallenna
        </Button>
      </Group>
    </Stack>
  );
}
