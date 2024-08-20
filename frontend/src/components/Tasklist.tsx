import { Box, Text } from "@mantine/core";
import useQueries from "../hooks/useQueries";
import { useFilteredData } from "../hooks/useFilteredData";
import TasklistItem from "./TasklistItem";
import { useEventListener, useListState, useMap } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";

export default function Tasklist() {
  // const { tasksQuery, usersQuery, channelsQuery } = useQueries();
  const { tasks } = useFilteredData({ status: ["todo"] });

  const tasksWithVisibility = tasks.map((task) => ({
    visible: false,
    task: task,
  }));

  const a = useMap(tasks.map((task) => [task._id, [false, task]]));

  return (
    <Box>
      {Array.from(a.entries()).map(([id, val]) => (
        <TasklistItem
          task={val[1] as ExtendedTask}
          selected={val[0] as boolean}
          onClick={() => a.set(id, [!val[0], val[1]])}
        />
      ))}
    </Box>
  );
}
