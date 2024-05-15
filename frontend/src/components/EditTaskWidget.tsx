import { useSetState } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import StatusSelect from "./StatusSelect";
import { UsersSingleSelect } from "./UsersMultiSelect";
import { statuses } from "../types/Status";
import useQueries from "../hooks/useQueries";

export default function EditTaskWidget({
  initialTask,
  onSave,
}: {
  initialTask: ExtendedTask;
  onSave: (task: ExtendedTask) => void;
  onCancel: () => void;
}) {
  const [editedTask, editTask] = useSetState(initialTask);
  const { usersQuery } = useQueries();

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
          editTask({
            assignee: usersQuery.data?.find((user) => user.id === userID),
          })
        }
        value={editedTask.assignee?.id ?? null}
        users={usersQuery.data}
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
