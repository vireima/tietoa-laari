import {
  Accordion,
  AccordionPanelProps,
  ActionIcon,
  Box,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
} from "@mantine/core";
import {
  IconUserCircle,
  IconUserCheck,
  IconCalendarUp,
  IconCalendarDot,
  IconEdit,
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
import EditTaskWidget from "./EditTaskWidget";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import patchTasks from "../api/patchTasks";

interface TaskAccordionPanelProps extends AccordionPanelProps {
  task: ExtendedTask;
}

export default function TaskAccordionPanel({ task }: TaskAccordionPanelProps) {
  const [opened, handlers] = useDisclosure(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: patchTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Accordion.Panel>
      <LoadingOverlay visible={mutation.isPending} zIndex={1000} />
      <Modal
        opened={opened}
        onClose={handlers.close}
        size={"lg"}
        title="Muokkaa ehdotusta"
      >
        <EditTaskWidget
          initialTask={task}
          onSave={async (task) => {
            mutation.mutate([task]);
            handlers.close();
          }}
          onCancel={handlers.close}
        />
      </Modal>
      <Stack>
        <Flex align="flex-start" justify="space-between">
          <MarkdownFormattedText text={task.description} />
          <ActionIcon onClick={handlers.open} variant="light">
            <IconEdit stroke={1.2} />
          </ActionIcon>
        </Flex>
        <Divider />
        <CommentThreadSpoiler
          task={task}
          showLabel="Näytä viestiketju"
          hideLabel="Piilota viestiketju"
        />
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
          <PriorityInfopill task={task} />
          <VoteInfopill task={task} />
        </Group>
      </Stack>
    </Accordion.Panel>
  );
}
