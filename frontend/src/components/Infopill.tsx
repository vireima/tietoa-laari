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
  IconLock,
  IconAt,
  IconHash,
  IconUrgent,
  IconZzz,
  IconThumbUp,
} from "@tabler/icons-react";
import { userDisplayName } from "../api/getUsers";
import { ExtendedTask } from "../types/Task";
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
          <Group gap="xs" wrap="nowrap">
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

export function StatusInfopill({ task }: { task: ExtendedTask }) {
  return (
    <Infopill
      Icon={task.status.iconElement}
      text={task.status.label}
      tooltip="Status"
      bg={task.status.bgcolor}
      c={task.status.color}
      color={task.status.color}
      pl="0.3rem"
      pr="1rem"
      style={{ borderRadius: "1rem" }}
    />
  );
}

export function ChannelInfopill({ task }: { task: ExtendedTask }) {
  if (!task.channel) return undefined;

  const icon = task.channel.is_private
    ? IconLock
    : task.channel.is_im
    ? IconAt
    : IconHash;
  return (
    <Infopill
      Icon={icon}
      text={task.channel.name || task.channel.id}
      tooltip="Slack-kanava"
      href={`https://tietoa.slack.com/archives/${task.channel.id}/p${task.ts}`}
    />
  );
}

export function PriorityInfopill({ task }: { task: ExtendedTask }) {
  if (task.priority === 0) return undefined;

  return task.priority > 0 ? (
    <Infopill
      Icon={IconUrgent}
      text={task.priority.toString()}
      tooltip="Prioriteetti"
      bg={`red.${Math.min(task.priority + 2, 9)}`}
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

export function VoteInfopill({ task }: { task: ExtendedTask }) {
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
            {vote.reaction} {userDisplayName(vote.user)}
          </Text>
        ))}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
