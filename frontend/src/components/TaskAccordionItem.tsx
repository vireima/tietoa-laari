import {
  Accordion,
  AccordionItemProps,
  Avatar,
  Grid,
  Group,
  Modal,
  Text,
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
    >
      <Accordion.Control /*icon={<UserWidget user={task.author} />}*/>
        <Grid>
          <Grid.Col span="content">
            <Text c="dimmed" miw="8rem" opacity={0.5} size="sm">
              {task.created.toRelative()}
            </Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <MarkdownStrippedText text={task.description} />
          </Grid.Col>
          <Grid.Col span="content">
            <Group gap="xs" wrap="nowrap">
              <VotesWidget task={task} />
              <PriorityInfopill task={task} />
            </Group>
          </Grid.Col>
          <Grid.Col span={1}>
            <Avatar.Group>
              {task.assignees.map((assignee) => (
                <Avatar src={assignee?.profile.image_512} size="sm" />
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
