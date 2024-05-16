import Channel from "../types/Channel";
import { ExtendedTask, InputTask } from "../types/Task";
import User from "../types/User";
import { Paper, LoadingOverlay, Box, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditTaskWidget from "./EditTaskWidget";
import DisplayTaskWidget from "./DisplayTaskWidget";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import patchTasks from "../api/patchTasks";

export default function TaskWidget({
  initialTask,
  users,
  channels,
}: {
  initialTask: ExtendedTask;
  users: User[] | undefined;
  channels: Channel[] | undefined;
  onTaskChange?: (task: InputTask) => void;
}) {
  const [opened, handlers] = useDisclosure(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: patchTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Paper shadow="lg" withBorder p="1rem">
      <Box pos="relative">
        <LoadingOverlay visible={mutation.isPending} zIndex={1000} />
        <Modal
          opened={opened}
          onClose={handlers.close}
          title="Muokkaus"
          size="lg"
        >
          <EditTaskWidget
            initialTask={initialTask}
            onSave={async (task) => {
              console.log("onSave()", task);
              mutation.mutate([task]);
              handlers.close();
            }}
            onCancel={() => {
              handlers.close();
            }}
          />
        </Modal>
        <DisplayTaskWidget
          task={initialTask}
          users={users}
          channels={channels}
          onEdit={handlers.open}
        />
      </Box>
    </Paper>
  );
}
