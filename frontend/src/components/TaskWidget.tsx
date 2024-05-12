import Channel from "../types/Channel";
import { Task } from "../types/Task";
import User from "../types/User";
import { Paper, LoadingOverlay, Box, Container } from "@mantine/core";
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
  initialTask: Task;
  users: User[] | undefined;
  channels: Channel[] | undefined;
  onTaskChange?: (task: Task) => void;
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
        {!opened ? (
          <Container onClick={() => handlers.open()}>
            <DisplayTaskWidget
              task={initialTask}
              users={users}
              channels={channels}
            />
          </Container>
        ) : (
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
        )}
      </Box>
    </Paper>
  );
}
