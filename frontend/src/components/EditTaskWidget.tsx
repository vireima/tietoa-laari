import { useHotkeys, useSetState } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import {
  Button,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  Switch,
  Textarea,
  Title,
} from "@mantine/core";
import StatusSelect from "./StatusSelect";
// import UsersMultiSelect, { UsersSingleSelect } from "./UsersMultiSelect";
import UsersMultiSelect from "./Users/UsersMultiSelect";
import { statuses } from "../types/Status";
import useMappedQueries from "../hooks/useMappedQueries";

function filterDefined(inputs: (string | undefined)[]) {
  return inputs.filter((i) => !!i) as string[];
}

export default function EditTaskWidget({
  initialTask,
  onSave,
}: {
  initialTask: ExtendedTask;
  onSave: (task: ExtendedTask) => void;
  onCancel: () => void;
}) {
  const [editedTask, editTask] = useSetState(initialTask);
  const { usersMap } = useMappedQueries();
  useHotkeys([["mod+Enter", () => onSave(editedTask)]], []);

  return (
    <Stack gap="xl">
      <Textarea
        data-autofocus
        label="Kuvaus"
        description="Ensimmäinen rivi on asian otsikko. Kuvausta voi muokata myös Slack-viestiä editoimalla."
        value={editedTask.description}
        minRows={5}
        autosize
        onChange={(event) =>
          editTask({ description: event.currentTarget.value })
        }
      />
      {/* <UsersSingleSelect
        label="Vastuullinen tekijä"
        description="Rajaa ehdotuksia vastuullisen tekijän mukaan"
        onChange={(userID) =>
          editTask({
            assignee: usersQuery.data?.find((user) => user.id === userID),
          })
        }
        value={editedTask.assignee?.id ?? null}
        users={usersQuery.data}
      /> */}
      <UsersMultiSelect
        label="Vastuulliset"
        description="Toteuttamisesta vastaavat henkilöt. Kuka teki/tekee valmiiksi ja keneltä voi kysyä lisää?"
        value={filterDefined(editedTask.assignees.map((user) => user?.id))}
        onChange={(users) =>
          editTask({
            assignees: users.map((userId) => usersMap.get(userId)),
          })
        }
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
      <Divider />
      <Switch
        label="Arkistoi"
        description="Arkistoi ehdotus. Ei näy sen jälkeen enää missään. Arkistoi tuplat, turhat ja virheet."
        checked={editedTask.archived}
        color="red"
        onChange={(event) =>
          editTask({ archived: event.currentTarget.checked })
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
