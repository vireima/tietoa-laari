import {
  Accordion,
  Avatar,
  Box,
  Center,
  Divider,
  Group,
  Stack,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { useFilteredData } from "../hooks/useFilteredData";
import formatRawMarkdown, { stripRawMarkdown } from "../api/formatRawMarkdown";
import { mapUserIDs, userDisplayName } from "../api/getUsers";
import {
  IconUserCircle,
  IconUserCheck,
  IconCalendarUp,
  IconCalendarDot,
  IconSparkles,
} from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import {
  StatusInfopill,
  Infopill,
  ChannelInfopill,
  PriorityInfopill,
  VoteInfopill,
} from "../components/Infopill";
import filteredTaskContainerProps from "../types/FilteredTaskContainerProps";

export default function TaskAccordion({ filter }: filteredTaskContainerProps) {
  const { tasks, usersQuery, channelsQuery } = useFilteredData(filter);
  const usersMap = mapUserIDs(usersQuery.data);
  const channelsMap = new Map(channelsQuery.data?.map((ch) => [ch.id, ch]));

  return (
    <Box p={{ base: "0.2rem", sm: "1rem", lg: "2rem" }} mt="4rem">
      {tasks?.length ? (
        <Accordion variant="filled">
          {tasks?.map((task) => (
            <Accordion.Item key={task.ts} value={task.ts}>
              <Accordion.Control
                icon={<Avatar src={task.author?.profile.image_32} size="sm" />}
              >
                <Text lineClamp={1}>
                  {
                    stripRawMarkdown(
                      task.description,
                      usersMap,
                      channelsMap
                    ).split("\n", 1)[0]
                  }
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <TypographyStylesProvider>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatRawMarkdown(
                          task.description,
                          usersMap,
                          channelsMap
                        ),
                      }}
                    />
                  </TypographyStylesProvider>
                  <Divider />
                  <Group gap="xs">
                    <StatusInfopill task={task} />
                    <Infopill
                      Icon={IconUserCircle}
                      text={userDisplayName(task.author)}
                      tooltip="Ehdottaja"
                    />
                    <Infopill
                      Icon={IconUserCheck}
                      text={userDisplayName(task.assignee)}
                      tooltip="Vastuutettu"
                    />
                    <ChannelInfopill task={task} />
                    <Infopill
                      Icon={IconCalendarUp}
                      text={task.created.toLocaleString(DateTime.DATE_SHORT)}
                      tooltip="Ehdotettu"
                    />
                    <Infopill
                      Icon={IconCalendarDot}
                      text={task.modified.toRelative()}
                      tooltip="Muokattu"
                    />
                    <PriorityInfopill task={task} />
                    <VoteInfopill task={task} />
                  </Group>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
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