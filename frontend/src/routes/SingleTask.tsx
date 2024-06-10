import { Accordion, Box } from "@mantine/core";
import { useParams } from "react-router-dom";
import useSingleTaskQuery from "../hooks/useSingleTaskQuery";
import useMappedQueries from "../hooks/useMappedQueries";
import { extendTask } from "../hooks/useFilteredData";
import TaskAccordionItem from "../components/TaskAccordionItem";

export default function SingleTask() {
  const { channel, ts } = useParams();
  const { usersMap, channelsMap } = useMappedQueries();
  const { query } = useSingleTaskQuery(channel ?? "", ts ?? "");

  const task = query.data
    ? extendTask(query.data, channelsMap, usersMap)
    : undefined;

  console.log(query.data);

  return (
    <Box mt="6rem">
      {/* <Stack>
        <Text c={"red"}>
          {channel} {ts}
        </Text>
        <Text>{task?.author?.name}</Text>
        <Text>{query.isLoading}</Text>
        <Text>{task?.description}</Text>
      </Stack> */}
      {task && (
        <Accordion variant="filled" value={task.ts}>
          <TaskAccordionItem key={task.ts} value={task.ts} task={task} />
        </Accordion>
      )}
    </Box>
  );
}
