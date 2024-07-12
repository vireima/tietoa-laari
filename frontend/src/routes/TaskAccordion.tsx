import { Accordion, Box, Center, Group, Text } from "@mantine/core";
import { useFilteredData } from "../hooks/useFilteredData";
import { IconSparkles } from "@tabler/icons-react";
import filteredTaskContainerProps from "../types/FilteredTaskContainerProps";
import { useState } from "react";
import TaskAccordionItem from "../components/TaskAccordionItem";

export default function TaskAccordion({ filter }: filteredTaskContainerProps) {
  const { tasks } = useFilteredData(filter);
  const [selected, setSelected] = useState<string | null>(null);

  console.log("Tasks shown:", tasks);

  return (
    <Box
      p={{ base: "0.2rem", sm: "1rem", lg: "10rem", xl: "20rem" }}
      pt={0}
      mt="6rem"
    >
      {tasks?.length ? (
        <Accordion
          variant="filled"
          value={selected}
          onChange={setSelected}
          chevronPosition="left"
        >
          {tasks?.map((task) => (
            <TaskAccordionItem key={task.ts} value={task.ts} task={task} />
          ))}
        </Accordion>
      ) : (
        <Center mt="4rem">
          <Group>
            <IconSparkles stroke={1} opacity={0.5} />
            <Text c="dimmed">Ei tuloksia</Text>
          </Group>
        </Center>
      )}
    </Box>
  );
}
