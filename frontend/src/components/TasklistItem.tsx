import {
  Anchor,
  Box,
  Group,
  Indicator,
  Spoiler,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { ExtendedTask, TaskWithVisualOverrides } from "../types/Task";
import { IconThumbUpFilled } from "@tabler/icons-react";
import StatusDropdown from "./StatusDropdown";
import Tooltip from "./Tooltip";
import FormattedText from "./FormattedText";
import UserTag from "./Users/UserTag";
import { TeamTags } from "./TeamTag";
import { DateTime } from "ts-luxon";
import useAuthenticatedID from "../hooks/useAuthenticatedID";

interface TasklistItemProps extends React.ComponentPropsWithoutRef<"button"> {
  task: TaskWithVisualOverrides;
  selected: boolean;
  // opened: boolean;
  highlight?: string;
  onOpen: (task: ExtendedTask) => void;
}

export default function TasklistItem({
  task,
  // opened,
  onOpen,
}: TasklistItemProps) {
  const current_user = useAuthenticatedID();

  return (
    <Table.Tr
      {...(task.faded ? { opacity: 0.2 } : {})}
      // bg={current_user?.id === task.author?.id ? "lime.1" : undefined}
    >
      <Table.Td
        onClick={() => {
          onOpen(task);
        }}
      >
        <Spoiler
          showLabel=""
          hideLabel=""
          expanded={task.opened}
          maxHeight={25}
          m={0}
        >
          <Stack>
            <FormattedText text={task.description} />

            <Group gap={"xs"}>
              <Anchor
                // c="dimmed"
                size="sm"
                href={`https://tietoa.slack.com/archives/${task?.channel?.id}/p${task.ts}`}
                target="_blank"
              >
                ↦ Slack-linkki
              </Anchor>
              {task.slite ? (
                <Anchor
                  size="sm"
                  href={`https://tietoa.slite.com/api/s/${task.slite}`}
                  target="_blank"
                >
                  ↦ Slite-linkki
                </Anchor>
              ) : (
                <></>
              )}
              <Text c="dimmed" size="sm">
                Luotu:{" "}
                {task.created.toLocaleString({
                  month: "numeric",
                  day: "numeric",
                  minute: "numeric",
                  hour: "numeric",
                })}
              </Text>
              <Text c="dimmed" size="sm">
                Päivitetty:{" "}
                {task.modified.toLocaleString({
                  month: "numeric",
                  day: "numeric",
                  minute: "numeric",
                  hour: "numeric",
                })}
              </Text>
              <Text c="dimmed" size="sm">
                Ehdottaja: <UserTag user={task.author} />
              </Text>
              {task.assignees.length ? (
                <Group gap={"xs"}>
                  <Text c="dimmed" size="sm">
                    Työryhmä:
                  </Text>
                  {task.assignees.map((user, index) => (
                    <UserTag user={user} key={index} c="dimmed" size="sm" />
                  ))}
                </Group>
              ) : (
                <></>
              )}
            </Group>
          </Stack>
        </Spoiler>
      </Table.Td>
      <Table.Td visibleFrom="md">
        <Tooltip tooltip={task.created.toLocaleString(DateTime.DATETIME_FULL)}>
          <Text size="sm">{task.created.toRelative()}</Text>
        </Tooltip>
      </Table.Td>
      <Table.Td visibleFrom="md" style={{ whiteSpace: "nowrap" }}>
        <TeamTags task={task} />
      </Table.Td>
      {/* <Table.Td visibleFrom="md" style={{ whiteSpace: "nowrap" }}>
        <ChannelTag channel={task.channel} size="sm" />
      </Table.Td> */}
      <Table.Td>
        <StatusDropdown task={task} />
      </Table.Td>
      <Table.Td>
        {task.votes.length ? (
          <Tooltip
            tooltip={
              <Stack gap="xs">
                {task.votes.map((vote, index) => (
                  <Text key={index}>
                    {`@${vote.user?.profile.display_name}: ${vote.reaction}`}
                  </Text>
                ))}
              </Stack>
            }
          >
            <Group gap="xs">
              <IconThumbUpFilled size="1rem" stroke={2} />
              {task.votes.length}
            </Group>
          </Tooltip>
        ) : (
          <></>
        )}
      </Table.Td>
    </Table.Tr>
  );
}
