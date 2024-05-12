import { Stack, Group, Skeleton, Badge, Text } from "@mantine/core";
import {
  IconUserFilled,
  IconUserCheck,
  IconBrandSlack,
  IconCalendarUp,
  IconCalendarDot,
} from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import { Task } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";

export default function DisplayTaskWidget({
  task,
  users,
  channels,
}: {
  task: Task;
  users: User[] | undefined;
  channels: Channel[] | undefined;
}) {
  const author = users?.find((user) => user.id === task.author);
  const assignee = users?.find((user) => user.id === task.assignee);
  const channel = channels?.find((channel) => channel.id === task.channel);
  const created = DateTime.fromISO(task.created).setLocale("fi-FI");
  const modified = DateTime.fromISO(task.modified).setLocale("fi-FI");

  return (
    <Stack>
      <Text>{task.description}</Text>
      <Group gap="xs">
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
        <Badge variant="light">{task.status}</Badge>
      </Group>
    </Stack>
  );
}
