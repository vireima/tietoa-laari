import { Text, Drawer, Stack, Center, Title } from "@mantine/core";
import { DatePicker, DatesProvider } from "@mantine/dates";
import { useEffect, useState } from "react";
import "dayjs/locale/fi";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import EmojiConvertor from "emoji-js";
import { useQuery } from "@tanstack/react-query";
import getUsers from "../api/getUsers";
import getTasks from "../api/getTasks";
import getChannels from "../api/getChannels";
import UsersMultiSelect from "./UsersMultiSelect";
import ChannelsMultiSelect from "./ChannelsMultiSelect";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

export default function DrawerSettings({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const channelsQuery = useQuery({
    queryKey: ["channels", tasksQuery.data],
    queryFn: () => getChannels(tasksQuery.data),
    enabled: !!usersQuery.data,
  });

  const [searchParams] = useSearchParams();

  const afterString = searchParams.get("after");

  const [afterDate, setAfterDate] = useState<Date | null>(
    afterString ? new Date(afterString) : null
  );
  const [authors, setAuthors] = useState<string[] | undefined>(
    searchParams.getAll("author")
  );
  const [assignees, setAssignees] = useState<string[] | undefined>(
    searchParams.getAll("assignee")
  );
  const [channels, setChannels] = useState<string[] | undefined>(
    searchParams.getAll("channel")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const query: Record<string, string | string[]> = {};
    if (afterDate) query.after = afterDate.toISOString();
    if (authors && authors.length) query.author = authors;
    if (assignees && assignees.length) query.assignee = assignees;
    if (channels && channels?.length) query.channel = channels;

    const params = createSearchParams(query);
    navigate(`/?${params.toString()}`);
  }, [navigate, authors, assignees, channels, afterDate]);

  return (
    <>
      <Drawer opened={opened} onClose={onClose} size="xs">
        <Stack>
          <Stack gap="xs">
            <Title order={6} lh="xs">
              Ehdotuksen luontiaika
            </Title>
            <Text c="dimmed" size="xs" lh="xs">
              Näytä vain valitun päivämäärän jälkeen luodut ehdotukset
            </Text>
          </Stack>
          <Center>
            <DatesProvider
              settings={{ locale: "fi", timezone: "Europe/Helsinki" }}
            >
              <DatePicker
                value={afterDate}
                onChange={setAfterDate}
                allowDeselect
              />
            </DatesProvider>
          </Center>
          <UsersMultiSelect
            label="Ehdotuksen tekijä"
            description="Rajaa ehdotuksia tekijän mukaan"
            onChange={setAuthors}
            value={authors}
            users={usersQuery.data}
          />
          <UsersMultiSelect
            label="Vastuullinen tekijä"
            description="Rajaa ehdotuksia vastuullisen tekijän mukaan"
            onChange={setAssignees}
            value={assignees}
            users={usersQuery.data}
          />
          <ChannelsMultiSelect
            label="Slack-kanava"
            description="Rajaa ehdotuksia Slack-kanavan mukaan"
            onChange={setChannels}
            value={channels}
            channels={channelsQuery.data}
          />
        </Stack>
      </Drawer>
    </>
  );
}
