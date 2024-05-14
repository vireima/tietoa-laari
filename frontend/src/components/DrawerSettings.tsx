import {
  Text,
  Drawer,
  Stack,
  Center,
  Title,
  NumberInput,
  Divider,
} from "@mantine/core";
import { DatePicker, DatesProvider } from "@mantine/dates";
import { useEffect, useState } from "react";
import "dayjs/locale/fi";
import { createSearchParams, useSearchParams } from "react-router-dom";
import EmojiConvertor from "emoji-js";
import UsersMultiSelect from "./UsersMultiSelect";
import { IconUrgent } from "@tabler/icons-react";
import SortOptionsMultiSelect from "./SortOptionsMultiSelect";
import useQueries from "../hooks/useQueries";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

export default function DrawerSettings({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  // const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  // const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });
  // const channelsQuery = useQuery({
  //   queryKey: ["channels", tasksQuery.data],
  //   queryFn: () => getChannels(tasksQuery.data),
  //   enabled: !!usersQuery.data,
  // });

  const { usersQuery } = useQueries();

  const [searchParams, setSearchParams] = useSearchParams();

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
  // const [channels, setChannels] = useState<string[] | undefined>(
  //   searchParams.getAll("channel")
  // );
  const [priority, setPriority] = useState<number | string | undefined>(
    Number(searchParams.get("priority"))
  );
  const [sort, setSort] = useState<string[]>(searchParams.getAll("sort"));

  useEffect(() => {
    const query: Record<string, string | string[]> = {};
    if (afterDate) query.after = afterDate.toISOString();
    if (authors && authors.length) query.author = authors;
    if (assignees && assignees.length) query.assignee = assignees;
    // if (channels && channels?.length) query.channel = channels;
    if (priority) query.priority = priority.toString();
    if (sort && sort.length) query.sort = sort;

    const params = createSearchParams(query);
    setSearchParams(params);
  }, [
    authors,
    assignees,
    // channels,
    afterDate,
    priority,
    sort,
    setSearchParams,
  ]);

  return (
    <>
      <Drawer opened={opened} onClose={onClose} size="sm">
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
            description="Rajaa ehdotuksia alkuperäisen ehdottajan mukaan"
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
          {/* <ChannelsMultiSelect
            label="Slack-kanava"
            description="Rajaa ehdotuksia Slack-kanavan mukaan"
            onChange={setChannels}
            value={channels}
            channels={channelsQuery.data}
          /> */}
          <NumberInput
            label="Prioriteetti"
            description="Näytä vain tätä korkeammalle priorisoidut ehdotukset"
            value={priority}
            onChange={setPriority}
            leftSection={<IconUrgent stroke={1.2} size="1.2rem" />}
          />
          <Divider />
          <SortOptionsMultiSelect
            label="Järjestely"
            placeholder="Valitse..."
            value={sort}
            onChange={setSort}
          />
        </Stack>
      </Drawer>
    </>
  );
}
