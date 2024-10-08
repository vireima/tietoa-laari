import {
  Box,
  Center,
  Grid,
  Group,
  keys,
  Stack,
  Table,
  Text,
  TextInput,
  Transition,
} from "@mantine/core";
import useQueries from "../hooks/useQueries";
import { useFilteredData } from "../hooks/useFilteredData";
import TasklistItem from "./TasklistItem";
import { useEventListener, useListState, useMap } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import { useState } from "react";
import { IconThumbUpFilled } from "@tabler/icons-react";
import classes from "../Styles/Tasklist.module.css";

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
        <Table stickyHeader highlightOnHover layout="fixed">
          <Table.Thead>
            <Table.Tr style={{ fontWeight: 700 }}>
              <Table.Td w="70%">Kuvaus</Table.Td>
              <Table.Td></Table.Td>
              <Table.Td w="4em"></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td visibleFrom="md">Ehdottaja</Table.Td>
              <Table.Td visibleFrom="md">Kanava</Table.Td>
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
                <Table.Td>
                  <task.status.iconElement size="1rem" stroke={2} />
                </Table.Td>
                <Table.Td>
                  {task.votes.length ? (
                    <Group gap="xs">
                      <IconThumbUpFilled size="1rem" stroke={2} />
                      {task.votes.length}
                    </Group>
                  ) : (
                    <></>
                  )}
                </Table.Td>
                <Table.Td>{task.tags.join(" ")}</Table.Td>
                <Table.Td visibleFrom="md">
                  {task.author?.profile.display_name}
                </Table.Td>
                <Table.Td visibleFrom="md">#{task.channel?.name}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Text>Valittuja: {selected.size}</Text>
      </Stack>
    </Center>
  );
}
