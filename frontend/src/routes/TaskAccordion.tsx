import { Accordion, Box, Center, Group, Text } from "@mantine/core";
import { useFilteredData } from "../hooks/useFilteredData";
import { IconSparkles } from "@tabler/icons-react";
import filteredTaskContainerProps from "../types/FilteredTaskContainerProps";
import { useState } from "react";
import TaskAccordionItem from "../components/TaskAccordionItem";

export default function TaskAccordion({ filter }: filteredTaskContainerProps) {
  const { tasks } = useFilteredData(filter);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Box p={{ base: "0.2rem", sm: "1rem", lg: "2rem" }} mt="4rem">
      {tasks?.length ? (
        <Accordion
          variant="contained"
          chevronPosition="left"
          value={selected}
          onChange={setSelected}
        >
          {tasks?.map((task) => (
            <TaskAccordionItem key={task.ts} value={task.ts} task={task} />
            // <Accordion.Item key={task.ts} value={task.ts}>
            //   <Accordion.Control icon={<UserWidget user={task.author} />}>
            //     <Group justify="space-between">
            //       <MarkdownStrippedText text={task.description} />
            //       <Group gap="xs">
            //         <VotesWidget task={task} />
            //         <PriorityInfopill task={task} />
            //       </Group>
            //     </Group>
            //   </Accordion.Control>
            //   <TaskAccordionPanel
            //     task={task}
            //     onKeyDown={getHotkeyHandler([
            //       ["E", () => console.log("painettiin e")],
            //     ])}
            //   />
            // </Accordion.Item>
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
