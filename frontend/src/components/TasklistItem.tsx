import {
  Anchor,
  Box,
  Collapse,
  Divider,
  Group,
  Popover,
  rem,
  Spoiler,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { ExtendedTask } from "../types/Task";
import { IconArrowRightBar, IconThumbUpFilled } from "@tabler/icons-react";
import StatusDropdown from "./StatusDropdown";
import classes from "../styles/Tasklist.module.css";
import { useElementSize, useTimeout } from "@mantine/hooks";
import { useState } from "react";
import Tooltip from "./Tooltip";

interface TasklistItemProps extends React.ComponentPropsWithoutRef<"button"> {
  task: ExtendedTask;
  selected: boolean;
  opened: boolean;
  onOpen: (task: ExtendedTask) => void;
}

export default function TasklistItem({
  task,
  opened,
  onOpen,
}: TasklistItemProps) {
  return (
    <Table.Tr>
      <Table.Td
        onClick={() => {
          onOpen(task);
        }}
      >
        <Spoiler showLabel="" hideLabel="" expanded={opened} maxHeight={25}>
          <Stack>
            <Text {...(opened ? {} : { truncate: "end" })}>
              {task.description}
            </Text>

            <Group>
              <Anchor
                // c="dimmed"
                size="sm"
                href={`https://tietoa.slack.com/archives/${task?.channel?.id}/p${task.ts}`}
                target="_blank"
              >
                ↦ Slack-linkki
              </Anchor>
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
                Ehdottaja: @{task.author?.profile.display_name}
              </Text>
              {task.assignees.length ? (
                <Text c="dimmed" size="sm">
                  Työryhmä:{" "}
                  {task.assignees
                    .map((user) => "@" + user?.profile.display_name)
                    .join(", ")}
                </Text>
              ) : (
                <></>
              )}
              {task.slite ? (
                <Anchor href={`https://tietoa.slite.com/api/s/${task.slite}`}>
                  Wiki
                </Anchor>
              ) : (
                <></>
              )}
            </Group>
          </Stack>
        </Spoiler>
      </Table.Td>
      <Table.Td style={{ verticalAlign: "top" }} visibleFrom="md">
        {task.created.toLocaleString()}
      </Table.Td>
      <Table.Td visibleFrom="md" style={{ whiteSpace: "nowrap" }}>
        #{task.channel?.name}
      </Table.Td>
      <Table.Td>
        <StatusDropdown task={task} />
      </Table.Td>
      <Table.Td>
        {task.votes.length ? (
          <Tooltip
            tooltip={
              <Stack gap="xs">
                {task.votes.map((vote) => (
                  <Text>
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
