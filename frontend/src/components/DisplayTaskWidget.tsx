import {
  Stack,
  Group,
  Divider,
  TypographyStylesProvider,
  ActionIcon,
} from "@mantine/core";
import {
  IconUserCheck,
  IconCalendarUp,
  IconCalendarDot,
  IconUserCircle,
  IconEdit,
} from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import { Task } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";
import { mapUserIDs } from "../api/getUsers";
import EmojiConvertor from "emoji-js";
import formatRawMarkdown from "../api/formatRawMarkdown";
import {
  ChannelInfopill,
  Infopill,
  PriorityInfopill,
  StatusInfopill,
  VoteInfopill,
} from "./Infopill";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

export default function DisplayTaskWidget({
  task,
  users,
  channels,
  onEdit,
}: {
  task: Task;
  users: User[] | undefined;
  channels: Channel[] | undefined;
  onEdit?: () => void;
}) {
  const author = users?.find((user) => user.id === task.author);
  const assignee = users?.find((user) => user.id === task.assignee);
  const channel = channels?.find((channel) => channel.id === task.channel);
  const created = DateTime.fromISO(task.created).setLocale("fi-FI");
  const modified = DateTime.fromISO(task.modified).setLocale("fi-FI");
  const usersMap = mapUserIDs(users);
  const channelsMap = new Map(channels?.map((ch) => [ch.id, ch]));

  return (
    <Stack>
      <Group justify="space-between" align="start">
        <TypographyStylesProvider w="80%">
          <div
            dangerouslySetInnerHTML={{
              __html: formatRawMarkdown(
                task.description,
                usersMap,
                channelsMap
              ),
            }}
          />
        </TypographyStylesProvider>
        <ActionIcon variant="default" onClick={onEdit}>
          <IconEdit stroke={1.5} size="1rem" />
        </ActionIcon>
      </Group>
      <Divider />
      <Group gap="xs">
        <StatusInfopill status={task.status} />
        <Infopill
          Icon={IconUserCircle}
          text={author?.profile.display_name || author?.name || task.author}
          tooltip="Ehdottaja"
        />
        <Infopill
          Icon={IconUserCheck}
          text={assignee?.profile.display_name || undefined}
          tooltip="Vastuutettu"
        />
        <ChannelInfopill channel={channel} task={task} />
        <Infopill
          Icon={IconCalendarUp}
          text={created.toLocaleString(DateTime.DATE_SHORT)}
          tooltip="Ehdotettu"
        />
        <Infopill
          Icon={IconCalendarDot}
          text={modified.toRelative()}
          tooltip="Muokattu"
        />
        <PriorityInfopill task={task} />
        <VoteInfopill task={task} usersMap={usersMap} />
      </Group>
    </Stack>
  );
}
