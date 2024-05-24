import { useSetState } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import {
  Button,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
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
    <Stack gap="xl">
      <Textarea
        label="Kuvaus"
        description="Kuvausta voi muokata myös Slack-viestiä editoimalla."
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
      <Title order={6}>Prioriteetti</Title>
      <SegmentedControl
        fullWidth
        radius="xl"
        value={editedTask.priority.toString()}
        data={[
          { label: "Vähäinen", value: "-1" },
          { label: "Tavallinen", value: "0" },
          { label: "Tärkeä", value: "1" },
        ]}
        onChange={(value) => editTask({ priority: Number(value) })}
      />
      <Divider />
      <Title order={6}>Status</Title>
      <StatusSelect
        status={editedTask.status.status}
        onStatusChange={(status) =>
          editTask({ status: statuses.find((st) => st.status === status) })
        }
      />
      <Group>
        <Button variant="light" onClick={() => onSave(editedTask)} fullWidth>
          Tallenna
        </Button>
      </Group>
    </Stack>
  );
}
