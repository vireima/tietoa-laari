import {
  Anchor,
  Box,
  Collapse,
  Group,
  rem,
  Spoiler,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { ExtendedTask } from "../types/Task";
import { IconThumbUpFilled } from "@tabler/icons-react";
import StatusDropdown from "./StatusDropdown";
import classes from "../styles/Tasklist.module.css";
import { useElementSize, useTimeout } from "@mantine/hooks";
import { useState } from "react";

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
        {/* <Stack
        // ref={ref}
        // className={
        //   opened
        //     ? `${classes.row} ${classes.open}`
        //     : `${classes.row} ${classes.closed}`
        // }
        // style={{ maxHeight: opened ? height : "2em" }}
        > */}
        {/* {!opened ? <Text truncate="end">{task.description}</Text> : <></>} */}
        {/* <Collapse in={opened} transitionDuration={1000}> */}
        <Spoiler showLabel="" hideLabel="" expanded={opened} maxHeight={25}>
          <Box
          // className={classes.row}
          // style={{
          //   maxHeight: !opened ? rem(25) : height ? rem(height) : undefined,
          // }}
          >
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
                Slack
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
                @{task.author?.profile.display_name}
              </Text>
            </Group>
          </Box>
        </Spoiler>
        {/* </Collapse> */}
        {/* </Stack> */}
      </Table.Td>
      <Table.Td style={{ verticalAlign: "top" }}>
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
            label={
              <Stack>
                {task.votes.map(
                  (vote) =>
                    `${vote.user?.profile.display_name}: ${vote.reaction}`
                )}
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
