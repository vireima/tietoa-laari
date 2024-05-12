import {
  Accordion,
  Avatar,
  Box,
  Divider,
  Group,
  Stack,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import useFilteredData from "../hooks/useFilteredData";
import formatRawMarkdown, { stripRawMarkdown } from "../api/formatRawMarkdown";
import { mapUserIDs } from "../api/getUsers";
import {
  IconUserCircle,
  IconUserCheck,
  IconCalendarUp,
  IconCalendarDot,
} from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import {
  StatusInfopill,
  Infopill,
  ChannelInfopill,
  PriorityInfopill,
  VoteInfopill,
} from "../components/Infopill";

export default function TaskAccordion() {
  const { filteredTasks, usersQuery, channelsQuery } = useFilteredData();
  const usersMap = mapUserIDs(usersQuery.data);
  const channelsMap = new Map(channelsQuery.data?.map((ch) => [ch.id, ch]));

  return (
    <Box p="1.5rem" bg="gray.1">
      <Accordion mt="4rem" variant="filled">
        {filteredTasks?.map((task) => (
          <Accordion.Item key={task.ts} value={task.ts}>
            <Accordion.Control
              icon={
                <Avatar
                  src={usersMap.get(task.author)?.profile.image_32}
                  size="sm"
                />
              }
            >
              <Text truncate="end" lineClamp={1}>
                {stripRawMarkdown(task.description, usersMap, channelsMap)}
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
                  <StatusInfopill status={task.status} />
                  <Infopill
                    Icon={IconUserCircle}
                    text={
                      usersMap.get(task.author)?.profile.display_name ||
                      usersMap.get(task.author)?.name ||
                      task.author
                    }
                    tooltip="Ehdottaja"
                  />
                  <Infopill
                    Icon={IconUserCheck}
                    text={
                      usersMap.get(task.assignee || "")?.profile.display_name ||
                      undefined
                    }
                    tooltip="Vastuutettu"
                  />
                  <ChannelInfopill
                    channel={channelsMap.get(task.channel)}
                    task={task}
                  />
                  <Infopill
                    Icon={IconCalendarUp}
                    text={DateTime.fromISO(task.created)
                      .setLocale("fi-FI")
                      .toLocaleString(DateTime.DATE_SHORT)}
                    tooltip="Ehdotettu"
                  />
                  <Infopill
                    Icon={IconCalendarDot}
                    text={DateTime.fromISO(task.modified)
                      .setLocale("fi-FI")
                      .toRelative()}
                    tooltip="Muokattu"
                  />
                  <PriorityInfopill task={task} />
                  <VoteInfopill task={task} usersMap={usersMap} />
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
}
