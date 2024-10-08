import {
  Box,
  Center,
  Grid,
  Group,
  keys,
  rem,
  Stack,
  Table,
  TableThProps,
  Text,
  TextInput,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import useQueries from "../hooks/useQueries";
import { useFilteredData } from "../hooks/useFilteredData";
import TasklistItem from "./TasklistItem";
import { useEventListener, useListState, useMap } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import classes from "../Styles/Tasklist.module.css";
import useSorted from "../hooks/useSorted";

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

  // console.log(
  //   "desc sorted:",
  //   isSorted("description"),
  //   isReversed("description")
  // );

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
        <Table stickyHeader highlightOnHover layout="fixed">
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
              {/* <Table.Td visibleFrom="md">Ehdottaja</Table.Td> */}
              <Table.Td miw="6em" visibleFrom="md">
                Kanava
              </Table.Td>
              <Th
                reversed={isReversed("status")}
                sorted={isSorted("status")}
                onSort={() => setSorting("status")}
                w="4rem"
              >
                St
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
              <Table.Tr
                key={task._id}
                onClick={() => setOpened(opened === task._id ? "" : task._id)}
                // onClick={() => toggle(task._id)}
                // style={{ transition: "all 3s ease-in-out 1s" }}
              >
                <Table.Td style={{ transition: "all 3s ease-in-out 1s" }}>
                  <Stack>
                    <Text
                      {...(opened != task._id ? { truncate: "end" } : {})}
                      style={{ transition: "all 3s ease-in-out 1s" }}
                    >
                      {/* {selected.get(task._id) ?? false ? ">" : ""} */}
                      {task.description}
                    </Text>
                    {opened === task._id ? (
                      <Group>
                        Luotu:{" "}
                        {task.created.toLocaleString({
                          month: "numeric",
                          day: "numeric",
                          minute: "numeric",
                          hour: "numeric",
                        })}
                        , päivitetty:{" "}
                        {task.modified.toLocaleString({
                          month: "numeric",
                          day: "numeric",
                          minute: "numeric",
                          hour: "numeric",
                        })}
                      </Group>
                    ) : (
                      <></>
                    )}
                  </Stack>
                </Table.Td>
                <Table.Td>{task.created.toLocaleString()}</Table.Td>
                <Table.Td visibleFrom="md" style={{ whiteSpace: "nowrap" }}>
                  #{task.channel?.name}
                </Table.Td>
                <Table.Td bg="red">
                  <task.status.iconElement size="1rem" stroke={2} />
                </Table.Td>
                <Table.Td bg="blue">
                  {task.votes.length ? (
                    <Group gap="xs">
                      <IconThumbUpFilled size="1rem" stroke={2} />
                      {task.votes.length}
                    </Group>
                  ) : (
                    <></>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Center>
  );
}
