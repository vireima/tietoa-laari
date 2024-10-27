import { Box, Group, Pill, Popover, TagsInput, TextProps } from "@mantine/core";
import { ExtendedTask } from "../types/Task";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { patchPartialTasks } from "../api/patchTasks";
import useAuth from "../hooks/useAuth";
import useQueries from "../hooks/useQueries";
import { IconMoodEmptyFilled } from "@tabler/icons-react";

export function TeamTag(task: ExtendedTask) {
  return <Pill>asda</Pill>;
}

interface TeamTagsProps extends TextProps {
  task: ExtendedTask;
}

function TeamTagInput({ task }: TeamTagsProps) {
  const [auth, setAuth] = useAuth();
  const { tasksQuery } = useQueries();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (tasks: Partial<ExtendedTask>[]) =>
      patchPartialTasks(tasks, auth),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <TagsInput
      variant="unstyled"
      placeholder="Lisää tiimi"
      value={mutation.isPending ? task.teams.concat("...") : task.teams}
      data={[
        ...new Set(
          tasksQuery.data
            ?.map((t) => t.teams)
            .reduce((prev, current) => prev.concat(current))
        ),
      ]}
      onChange={(teams) => {
        mutation.mutate([
          {
            _id: task._id,
            teams: teams,
          },
        ]);
      }}
    />
  );
}

export function TeamTags({ task }: TeamTagsProps) {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Group gap={"xs"}>
          {task.teams.length > 0 ? (
            task.teams.map((tag, index) => (
              <Pill key={index}>{tag.slice(0, 3).toUpperCase()}</Pill>
            ))
          ) : (
            <Pill opacity={0.3}>Tyhjä</Pill>
          )}
        </Group>
      </Popover.Target>
      <Popover.Dropdown>
        <TeamTagInput task={task} />
      </Popover.Dropdown>
    </Popover>
  );
}
