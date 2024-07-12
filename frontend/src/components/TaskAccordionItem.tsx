import {
  Accordion,
  AccordionItemProps,
  Avatar,
  Center,
  Grid,
  Group,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { PriorityInfopill } from "./Infopill";
import MarkdownStrippedText from "./MarkdownStrippedText";
import TaskAccordionPanel from "./TaskAccordionPanel";
import VotesWidget from "./VotesWidget";
import { ExtendedTask } from "../types/Task";
import EditTaskWidget from "./EditTaskWidget";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import patchTasks from "../api/patchTasks";
import { userDisplayName } from "../api/getUsers";
import styles from "../styles/TaskAccordionItem.module.css";

interface TaskAccordionItemProps extends AccordionItemProps {
  task: ExtendedTask;
}

export default function TaskAccordionItem({
  task,
  ...others
}: TaskAccordionItemProps) {
  const [opened, handlers] = useDisclosure(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: patchTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Accordion.Item
      {...others}
      key={task.ts}
      value={task.ts}
      onKeyDown={getHotkeyHandler([["mod+E", () => handlers.toggle()]])}
      className={styles.item}
    >
      <Accordion.Control /*icon={<UserWidget user={task.author} />}*/>
        <Grid>
          <Grid.Col span="content">
            <Center h="100%">
              <Text
                c="dimmed"
                miw="5rem"
                opacity={0.5}
                size="xs"
                visibleFrom="sm"
              >
                {task.created.toRelative()}
              </Text>
              <Text
                c="dimmed"
                miw="1rem"
                opacity={0.5}
                size="xs"
                hiddenFrom="sm"
              >
                {task.created.toLocaleString({
                  month: "numeric",
                  day: "numeric",
                })}
              </Text>
            </Center>
          </Grid.Col>
          <Grid.Col span="auto">
            <MarkdownStrippedText text={task.description} size="sm" />
          </Grid.Col>
          <Grid.Col span="content">
            <Group gap="xs" wrap="nowrap" visibleFrom="sm">
              <VotesWidget task={task} />
              <PriorityInfopill task={task} />
            </Group>
          </Grid.Col>
          <Grid.Col span={1}>
            <Avatar.Group>
              {task.assignees.map((assignee) => (
                <Tooltip
                  label={
                    assignee?.profile.real_name || userDisplayName(assignee)
                  }
                  withArrow
                  key={assignee?.id}
                >
                  <Avatar src={assignee?.profile.image_512} size="sm" />
                </Tooltip>
              ))}
            </Avatar.Group>
          </Grid.Col>
        </Grid>
      </Accordion.Control>

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
      <TaskAccordionPanel
        task={task}
        onEdit={handlers.open}
        loading={mutation.isPending}
      />
    </Accordion.Item>
  );
}
