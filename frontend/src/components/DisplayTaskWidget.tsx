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
import { ExtendedTask } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";
import { userDisplayName } from "../api/getUsers";
import EmojiConvertor from "emoji-js";
import formatRawMarkdown from "../api/formatRawMarkdown";
import {
  ChannelInfopill,
  Infopill,
  PriorityInfopill,
  StatusInfopill,
  VoteInfopill,
} from "./Infopill";
import useMappedQueries from "../hooks/useMappedQueries";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

export default function DisplayTaskWidget({
  task,
  onEdit,
}: {
  task: ExtendedTask;
  users: User[] | undefined;
  channels: Channel[] | undefined;
  onEdit?: () => void;
}) {
  const { usersMap, channelsMap } = useMappedQueries();

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
        <StatusInfopill task={task} />
        <Infopill
          Icon={IconUserCircle}
          text={userDisplayName(task.author)}
          tooltip="Ehdottaja"
        />
        <Infopill
          Icon={IconUserCheck}
          text={userDisplayName(task.assignee)}
          tooltip="Vastuutettu"
        />
        <ChannelInfopill task={task} />
        <Infopill
          Icon={IconCalendarUp}
          text={task.created.toLocaleString(DateTime.DATE_SHORT)}
          tooltip="Ehdotettu"
        />
        <Infopill
          Icon={IconCalendarDot}
          text={task.modified.toRelative()}
          tooltip="Muokattu"
        />
        <PriorityInfopill task={task} />
        <VoteInfopill task={task} />
      </Group>
    </Stack>
  );
}
