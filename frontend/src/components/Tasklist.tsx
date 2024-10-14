import {
  Center,
  Group,
  rem,
  Stack,
  Table,
  TableThProps,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useFilteredData } from "../hooks/useFilteredData";
import { useMap } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import { useState } from "react";
import {
  IconArrowBigRightLinesFilled,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import classes from "../Styles/Tasklist.module.css";
import useSorted from "../hooks/useSorted";
import StatusDropdown from "./StatusDropdown";
import TasklistItem from "./TasklistItem";

interface ThProps extends TableThProps {
  children: React.ReactNode | string;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort, ...others }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th {...others}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" gap="xs">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: ExtendedTask[], search: string) {
  if (!search) return data;

  const query = search.toLowerCase().trim();
  return data.filter(
    (item) =>
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      item.author?.profile.display_name.toLowerCase().includes(query)
  );
}

export default function Tasklist() {
  // const { tasksQuery, usersQuery, channelsQuery } = useQueries();
  const { tasks } = useFilteredData();
  const [search, setSearch] = useState("");
  const searchFilteredTasks = filterData(tasks, search);
  const selected = useMap<string, boolean>();
  const [opened, setOpened] = useState("");

  const [isSorted, isReversed, setSorting] = useSorted(tasks);

  const select = (id: string) => {
    selected.set(id, true);
  };
  const toggle = (id: string) => {
    selected.set(id, !(selected.get(id) ?? false));
  };

  return (
    <Center>
      <Stack maw={{ base: "100%", sm: "80%" }}>
        <TextInput
          value={search}
          placeholder="Vapaa haku"
          m="0.3em"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value);
          }}
        />
        <Table
          stickyHeader
          highlightOnHover
          layout="fixed"
          verticalSpacing="sm"
        >
          <Table.Thead>
            <Table.Tr style={{ fontWeight: 700 }}>
              <Th
                reversed={isReversed("description")}
                sorted={isSorted("description")}
                onSort={() => setSorting("description")}
                w="60%"
              >
                Ajatus
              </Th>
              <Th
                reversed={isReversed("created")}
                sorted={isSorted("created")}
                onSort={() => setSorting("created")}
              >
                Luotu
              </Th>
              <Th
                visibleFrom="md"
                reversed={isReversed("channel")}
                sorted={isSorted("channel")}
                onSort={() => setSorting("channel")}
              >
                Kanava
              </Th>

              <Th
                reversed={isReversed("status")}
                sorted={isSorted("status")}
                onSort={() => setSorting("status")}
                w="4rem"
              >
                <IconArrowBigRightLinesFilled size="1rem" stroke={2} />
              </Th>
              <Th
                reversed={isReversed("votes")}
                sorted={isSorted("votes")}
                onSort={() => setSorting("votes")}
                w="4rem"
              >
                <IconThumbUpFilled size="1rem" stroke={2} />
              </Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {searchFilteredTasks.map((task) => (
              <TasklistItem
                key={task._id}
                task={task}
                selected={false}
                opened={opened === task._id}
                onOpen={(openedTask) =>
                  setOpened(opened === openedTask._id ? "" : openedTask._id)
                }
              />
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Center>
  );
}
