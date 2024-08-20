import { Box, Text } from "@mantine/core";
import useQueries from "../hooks/useQueries";
import { useFilteredData } from "../hooks/useFilteredData";

export default function Tasklist() {
  // const { tasksQuery, usersQuery, channelsQuery } = useQueries();
  const { tasks } = useFilteredData({ status: ["todo"] });

  return (
    <Box>
      {tasks.map((task) => (
        <Text>{task.description}</Text>
      ))}
    </Box>
  );
}
