import {
  Accordion,
  AccordionPanelProps,
  ActionIcon,
  Box,
  Collapse,
  Divider,
  Flex,
  Group,
  Indicator,
  LoadingOverlay,
  Stack,
  Tooltip,
} from "@mantine/core";
import {
  IconUserCircle,
  IconUserCheck,
  IconCalendarUp,
  IconCalendarDot,
  IconEdit,
  IconMessage,
  IconChecklist,
} from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import { userDisplayName } from "../api/getUsers";
import {
  StatusInfopill,
  Infopill,
  ChannelInfopill,
  PriorityInfopill,
  VoteInfopill,
} from "./Infopill";
import { ExtendedTask } from "../types/Task";
import MarkdownFormattedText from "./MarkdownFormattedText";
import CommentThreadSpoiler from "./CommentThreadSpoiler";
import { useDisclosure } from "@mantine/hooks";
import { actionIconProps, iconProps } from "../config";
import useExtendedComments from "../hooks/useExtendedComments";

interface TaskAccordionPanelProps extends AccordionPanelProps {
  task: ExtendedTask;
  onEdit: () => void;
  loading?: boolean;
}

export default function TaskAccordionPanel({
  task,
  onEdit,
  loading,
}: TaskAccordionPanelProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const comments = useExtendedComments(task);

  return (
    <Accordion.Panel>
      <LoadingOverlay visible={!!loading} zIndex={1000} />
      <Stack>
        <Flex align="flex-start" justify="space-between">
          <MarkdownFormattedText text={task.description} />
        </Flex>
        <Divider />
        <Collapse in={opened}>
          <CommentThreadSpoiler
            task={task}
            showLabel="Näytä viestiketju"
            hideLabel="Piilota viestiketju"
          />
        </Collapse>
        <Group gap="xs">
          <StatusInfopill task={task} />
          <Infopill
            Icon={IconUserCircle}
            text={userDisplayName(task.author)}
            tooltip="Kirjaaja"
          />
          {task.assignees.map((assignee, index) => (
            <Box key={index}>
              {assignee ? (
                <Infopill
                  Icon={IconUserCheck}
                  text={userDisplayName(assignee)}
                  tooltip="Vastuu"
                />
              ) : (
                <></>
              )}
            </Box>
          ))}
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
          <Infopill
            Icon={IconChecklist}
            text={task.slite && "Slite"}
            href={`https://tietoa.slite.com/api/s/${task.slite}`}
            tooltip="Wiki-linkki"
          />
          <PriorityInfopill task={task} />
          <VoteInfopill task={task} />
          {comments?.length && comments.length > 1 && (
            <Tooltip label="Avaa Slack-kommentit" withArrow>
              <Indicator
                label={comments.length - 1}
                size={18}
                offset={0}
                withBorder
                inline
                styles={{ indicator: { fontSize: "0.6rem" } }}
              >
                <ActionIcon onClick={toggle} {...actionIconProps}>
                  <IconMessage {...iconProps} />
                </ActionIcon>
              </Indicator>
            </Tooltip>
          )}
          <Tooltip label="Muokkaa ehdotusta" withArrow>
            <ActionIcon onClick={onEdit} {...actionIconProps}>
              <IconEdit {...iconProps} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Accordion.Panel>
  );
}
