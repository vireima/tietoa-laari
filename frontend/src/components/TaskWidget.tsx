import Channel from "../types/Channel";
import { Task } from "../types/Task";
import User from "../types/User";
import { DateTime } from "ts-luxon";
import StatusWidget from "./StatusWidget";
import {
  Paper,
  Text,
  Stack,
  Group,
  Button,
  Badge,
  Loader,
  Skeleton,
} from "@mantine/core";
import {
  IconCalendarUp,
  IconCalendarDot,
  IconBrandSlack,
  IconUserFilled,
  IconUserCheck,
} from "@tabler/icons-react";
import { useSetState } from "@mantine/hooks";
import { Status } from "../types/Status";
import { useAsyncFn } from "react-use";
import axios from "axios";

export default function TaskWidget({
  initialTask,
  users,
  channels,
  onTaskChange,
}: {
  initialTask: Task;
  users: User[] | null;
  channels: Channel[] | null;
  onTaskChange: (task: Task) => void;
}) {
  const [task, setTask] = useSetState(initialTask);
  const [state, updateTask] = useAsyncFn(async () => {
    console.log(
      `Sending request to ${task._id} with payload ${JSON.stringify(task)}`
    );
    try {
      const response = await axios.patch("https://laari.up.railway.app/tasks", [
        task,
      ]);
      console.log("Calling onTaskChange", task._id);
      onTaskChange(task);
      return response.data;
    } catch (error) {
      console.error("Error patching a task:", error);
    }
  }, [task]);

  const author = users?.find((user) => user.id === task.author);
  const assignee = users?.find((user) => user.id === task.assignee);
  const channel = channels?.find((channel) => channel.id === task.channel);
  const created = DateTime.fromISO(task.created).setLocale("fi-FI");
  const modified = DateTime.fromISO(task.modified).setLocale("fi-FI");

  return (
    <Paper shadow="lg" withBorder p="1rem">
      <Stack>
        <Text>{task.description}</Text>
        <Group>
          <Skeleton visible={!users}>
            <Badge variant="light" leftSection={<IconUserFilled size="1rem" />}>
              @{author?.profile.display_name || author?.name || task.author}
            </Badge>
          </Skeleton>
          <Skeleton visible={!users}>
            <Badge variant="light" leftSection={<IconUserCheck size="1rem" />}>
              @{assignee?.profile.display_name || undefined}
            </Badge>
          </Skeleton>
          <Skeleton visible={!channel}>
            <Badge variant="light" leftSection={<IconBrandSlack size="1rem" />}>
              {channel?.name}
            </Badge>
          </Skeleton>
          <Badge variant="light" leftSection={<IconCalendarUp size="1rem" />}>
            {created.toLocaleString(DateTime.DATE_SHORT)}
          </Badge>
          <Badge variant="light" leftSection={<IconCalendarDot size="1rem" />}>
            {modified.toLocaleString(DateTime.DATE_SHORT)}
          </Badge>
          <Badge variant="light" leftSection={<IconCalendarDot size="1rem" />}>
            {modified.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
          </Badge>
          <StatusWidget
            status={task.status}
            setStatus={(val: string | null) =>
              setTask({ status: val as Status })
            }
          />
          <Button
            variant="filled"
            onClick={() => {
              console.log("click", task);
              updateTask();
            }}
          >
            {state.loading ? <Loader type="dots" /> : "Tallenna"}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
