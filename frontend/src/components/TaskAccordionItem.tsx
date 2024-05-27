import { Accordion, AccordionItemProps, Group, Modal } from "@mantine/core";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { PriorityInfopill } from "./Infopill";
import MarkdownStrippedText from "./MarkdownStrippedText";
import TaskAccordionPanel from "./TaskAccordionPanel";
import UserWidget from "./UserWidget";
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
      <Accordion.Control icon={<UserWidget user={task.author} />}>
        <Group justify="space-between">
          <MarkdownStrippedText text={task.description} />
          <Group gap="xs">
            <VotesWidget task={task} />
            <PriorityInfopill task={task} />
          </Group>
        </Group>
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
            console.log("mutate!", task);
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
