import {
  Stack,
  Group,
  Text,
  Tooltip,
  Divider,
  Anchor,
  HoverCard,
  Box,
  TypographyStylesProvider,
  ActionIcon,
  BoxProps,
  ThemeIcon,
  DefaultMantineColor,
  rem,
} from "@mantine/core";
import {
  IconUserCheck,
  IconCalendarUp,
  IconCalendarDot,
  IconCircle,
  IconUserCircle,
  IconHash,
  IconLock,
  IconAt,
  IconThumbUp,
  IconEdit,
  IconZzz,
  IconUrgent,
} from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import { Task } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";
import classes from "../styles/DisplayTaskWidget.module.css";
import React from "react";
import { Status, statuses } from "../types/Status";
import { mapUserIDs, userDisplayName } from "../api/getUsers";
import EmojiConvertor from "emoji-js";
import formatRawMarkdown from "../api/formatRawMarkdown";

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
        <StatusInfoPiece status={task.status} />
        <Infopiece
          Icon={IconUserCircle}
          text={author?.profile.display_name || author?.name || task.author}
          tooltip="Ehdottaja"
        />
        <Infopiece
          Icon={IconUserCheck}
          text={assignee?.profile.display_name || undefined}
          tooltip="Vastuutettu"
        />
        <ChannelInfoPiece channel={channel} task={task} />
        <Infopiece
          Icon={IconCalendarUp}
          text={created.toLocaleString(DateTime.DATE_SHORT)}
          tooltip="Ehdotettu"
        />
        <Infopiece
          Icon={IconCalendarDot}
          text={modified.toRelative()}
          tooltip="Muokattu"
        />
        <PriorityInfoPiece task={task} />
        <VoteInfoPiece task={task} usersMap={usersMap} />
      </Group>
    </Stack>
  );
}

interface InfoPieceProps extends BoxProps {
  Icon: React.ElementType;
  text: string | undefined;
  tooltip: string;
  href?: string;
  color?: DefaultMantineColor;
}

function Infopiece({
  Icon,
  text,
  tooltip,
  href = undefined,
  color = "gray.5",
  ...others
}: InfoPieceProps) {
  return (
    <Box {...others}>
      {text ? (
        <Tooltip label={tooltip}>
          <Group gap="xs">
            <ThemeIcon
              variant="transparent"
              color={color}
              size="sm"
              radius="xl"
            >
              <Icon size="1rem" stroke={2} className={classes.icon} />
            </ThemeIcon>
            {href ? (
              <Anchor
                href={href}
                target="_blank"
                size="xs"
                style={{ marginLeft: rem(-5) }}
              >
                {text}
              </Anchor>
            ) : (
              <Text size="xs" style={{ marginLeft: rem(-5) }}>
                {text}
              </Text>
            )}
          </Group>
        </Tooltip>
      ) : (
        ""
      )}
    </Box>
  );
}

function StatusInfoPiece({ status }: { status: Status }) {
  const statusVisualInfo = statuses.find((val) => val.status === status);

  return (
    <Infopiece
      Icon={statusVisualInfo?.iconElement || IconCircle}
      text={status}
      tooltip="Status"
      bg={statusVisualInfo?.bgcolor}
      c={statusVisualInfo?.color}
      color={statusVisualInfo?.color}
      pl="0.3rem"
      pr="1rem"
      style={{ borderRadius: "1rem" }}
    />
  );
}

function ChannelInfoPiece({
  channel,
  task,
}: {
  channel: Channel | undefined;
  task: Task;
}) {
  if (!channel) return undefined;

  const icon = channel.is_private
    ? IconLock
    : channel.is_im
    ? IconAt
    : IconHash;
  return (
    <Infopiece
      Icon={icon}
      text={channel.name || channel.id}
      tooltip="Slack-kanava"
      href={`https://tietoa.slack.com/archives/${channel.id}/p${task.ts}`}
    />
  );
}

function PriorityInfoPiece({ task }: { task: Task }) {
  if (task.priority === 0) return undefined;

  return task.priority > 0 ? (
    <Infopiece
      Icon={IconUrgent}
      text={task.priority.toString()}
      tooltip="Prioriteetti"
      bg={`red.${Math.min(task.priority + 1, 9)}`}
      c={"red.0"}
      color={"red.0"}
      pl="0.3rem"
      pr="1rem"
      style={{ borderRadius: "1rem" }}
    />
  ) : (
    <Infopiece
      Icon={IconZzz}
      text={task.priority.toString()}
      tooltip="Prioriteetti"
    />
  );
}

function VoteInfoPiece({
  task,
  usersMap,
}: {
  task: Task;
  usersMap: Map<string, User>;
}) {
  if (task.votes.length < 1) return undefined;

  return (
    <HoverCard>
      <HoverCard.Target>
        <Box>
          <Infopiece
            Icon={IconThumbUp}
            text={task.votes.length.toString()}
            tooltip="Slack-reaktioita"
          />
        </Box>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        {task.votes.map((vote, index) => (
          <Text key={index}>
            {emoji.replace_colons(`:${vote.reaction}:`)}{" "}
            {userDisplayName(usersMap.get(vote.user))}
          </Text>
        ))}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
