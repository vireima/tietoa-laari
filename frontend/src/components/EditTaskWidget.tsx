import { useSetState } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import StatusSelect from "./StatusSelect";
import { UsersSingleSelect } from "./UsersMultiSelect";
import User from "../types/User";
import { statuses } from "../types/Status";

export default function EditTaskWidget({
  initialTask,
  onSave,
  users,
}: {
  initialTask: ExtendedTask;
  onSave: (task: ExtendedTask) => void;
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
        onChange={(userID) =>
          editTask({ assignee: users?.find((user) => user.id === userID) })
        }
        value={editedTask.assignee?.id ?? null}
        users={users}
      />
      <StatusSelect
        status={editedTask.status.status}
        onChange={(status) =>
          editTask({ status: statuses.find((st) => st.status === status) })
        }
      />
      <Group>
        <Button variant="light" onClick={() => onSave(editedTask)}>
          Tallenna
        </Button>
      </Group>
    </Stack>
  );
}
