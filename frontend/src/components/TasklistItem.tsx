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
import MarkdownFormattedText from "./MarkdownFormattedText";
import FormattedText from "./FormattedText";
import UserTag from "./Users/UserTag";
import ChannelTag from "./Channels/ChannelTag";

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
        <Spoiler
          showLabel=""
          hideLabel=""
          expanded={opened}
          maxHeight={25}
          style={{ textOverflow: "ellipsis" }}
        >
          <Stack>
            <FormattedText text={task.description} />
            {/* <MarkdownFormattedText text={task.description} /> */}

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
        <ChannelTag channel={task.channel} size="sm" />
      </Table.Td>
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
