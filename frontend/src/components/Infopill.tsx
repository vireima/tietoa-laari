import {
  BoxProps,
  DefaultMantineColor,
  Box,
  Tooltip,
  Group,
  ThemeIcon,
  Anchor,
  rem,
  Text,
  HoverCard,
} from "@mantine/core";
import {
  IconCircle,
  IconLock,
  IconAt,
  IconHash,
  IconUrgent,
  IconZzz,
  IconThumbUp,
} from "@tabler/icons-react";
import { userDisplayName } from "../api/getUsers";
import Channel from "../types/Channel";
import { Status, statuses } from "../types/Status";
import { Task } from "../types/Task";
import User from "../types/User";
import classes from "../styles/DisplayTaskWidget.module.css";
import EmojiConvertor from "emoji-js";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

interface InfopillProps extends BoxProps {
  Icon: React.ElementType;
  text: string | undefined;
  tooltip: string;
  href?: string;
  color?: DefaultMantineColor;
}

export function Infopill({
  Icon,
  text,
  tooltip,
  href = undefined,
  color = "gray.5",
  ...others
}: InfopillProps) {
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

export function StatusInfopill({ status }: { status: Status }) {
  const statusVisualInfo = statuses.find((val) => val.status === status);

  return (
    <Infopill
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

export function ChannelInfopill({
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
    <Infopill
      Icon={icon}
      text={channel.name || channel.id}
      tooltip="Slack-kanava"
      href={`https://tietoa.slack.com/archives/${channel.id}/p${task.ts}`}
    />
  );
}

export function PriorityInfopill({ task }: { task: Task }) {
  if (task.priority === 0) return undefined;

  return task.priority > 0 ? (
    <Infopill
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
    <Infopill
      Icon={IconZzz}
      text={task.priority.toString()}
      tooltip="Prioriteetti"
    />
  );
}

export function VoteInfopill({
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
          <Infopill
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
