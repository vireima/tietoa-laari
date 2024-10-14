import {
  Anchor,
  Burger,
  Center,
  Container,
  Divider,
  Drawer,
  Flex,
  Group,
  List,
  ListItem,
  rem,
  Stack,
  Table,
  TableThProps,
  Text,
  TextInput,
  Title,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useFilteredData } from "../hooks/useFilteredData";
import { useDisclosure, useMap } from "@mantine/hooks";
import { useDisclosure, useMap } from "@mantine/hooks";
import { ExtendedTask } from "../types/Task";
import { useState } from "react";
import {
  IconArrowBigRightLinesFilled,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import classes from "../styles/Tasklist.module.css";
import useSorted from "../hooks/useSorted";
import StatusDropdown from "./StatusDropdown";
import TasklistItem from "./TasklistItem";
import Tooltip from "./Tooltip";
import Changelog from "./Changelog";

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
      item.channel?.name?.toLowerCase().includes(query) ||
      item.status.label.toLowerCase().includes(query) ||
      item.channel?.name?.toLowerCase().includes(query) ||
      item.status.label.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      item.author?.profile.display_name.toLowerCase().includes(query) ||
      item.assignees.some((user) =>
        user?.profile.display_name.toLowerCase().includes(query)
      )
      item.author?.profile.display_name.toLowerCase().includes(query) ||
      item.assignees.some((user) =>
        user?.profile.display_name.toLowerCase().includes(query)
      )
  );
}

export default function Tasklist() {
  // const { tasksQuery, usersQuery, channelsQuery } = useQueries();
  const { tasks } = useFilteredData();
  const [search, setSearch] = useState("");
  const searchFilteredTasks = filterData(tasks, search);
  const selected = useMap<string, boolean>();
  const [opened, setOpened] = useState("");
  const [settingsOpened, { toggle: settingsToggle, close: settingsClose }] =
    useDisclosure(false);
  const [settingsOpened, { toggle: settingsToggle, close: settingsClose }] =
    useDisclosure(false);

  const [isSorted, isReversed, setSorting] = useSorted(tasks);

  const select = (id: string) => {
    selected.set(id, true);
  };
  const toggle = (id: string) => {
    selected.set(id, !(selected.get(id) ?? false));
  };

  return (
    <Center>
      <Drawer
        opened={settingsOpened}
        onClose={settingsClose}
        position="bottom"
        title={<Title>Laari</Title>}
        overlayProps={{ backgroundOpacity: 0.15 }}
        padding={"xl"}
        size={"xl"}
      >
        <Stack>
          <Text>
            Laari on Tietoan kehitysideoiden ja -ajatusten talletuspaikka.
            Työympäristössä jotain kehitettävää? Laita ajatus joihinkin
            seuraavista kanavista:
          </Text>
          <List ml="1rem">
            <ListItem>
              <Group>
                <Anchor href="slack://channel?team=T1FB2571R&id=C07RJR1R2PQ">
                  #team-laari-tie
                </Anchor>
                Tietomallinnus-tiimit kehitysideat
              </Group>
            </ListItem>
            <ListItem>
              <Group>
                <Anchor href="slack://channel?team=T1FB2571R&id=C07RC1CA99V">
                  #team-laari-lah
                </Anchor>
                Lähtötiedot-tiimit kehitysideat
              </Group>
            </ListItem>
            <ListItem>
              <Group>
                <Anchor href="slack://channel?team=T1FB2571R&id=C07S57XKTR7">
                  #team-laari-vis
                </Anchor>
                Visualisointi-tiimit kehitysideat
              </Group>
            </ListItem>
            <ListItem>
              <Group>
                <Anchor href="slack://channel?team=T1FB2571R&id=C07RSEW76D9">
                  #c-laari
                </Anchor>
                Kaikki muut kehitysideat
              </Group>
            </ListItem>
          </List>
          <Text>
            Teknisissä asioissa laita idea Laariin tai pistä viesti{" "}
            <Anchor
              href="slack://user?team=T1FB2571R&id=DCHJRD96D"
              underline="always"
            >
              @ville
            </Anchor>
            lle.
          </Text>
          <Divider />
          <Changelog />
        </Stack>
      </Drawer>
      <Stack maw={{ base: "100%", sm: "80%" }}>
        <Flex wrap={"nowrap"} justify={"flex-start"} align={"center"}>
          <Burger opened={settingsOpened} onClick={settingsToggle}></Burger>
          <TextInput
            w="100%"
            value={search}
            placeholder="Vapaa haku"
            m="0.3em"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(event.currentTarget.value);
            }}
          />
        </Flex>
        <Flex wrap={"nowrap"} justify={"flex-start"} align={"center"}>
          <Burger opened={settingsOpened} onClick={settingsToggle}></Burger>
          <TextInput
            w="100%"
            value={search}
            placeholder="Vapaa haku"
            m="0.3em"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(event.currentTarget.value);
            }}
          />
        </Flex>
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
                visibleFrom="md"
                visibleFrom="md"
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
                <Tooltip tooltip="Status">
                  <IconArrowBigRightLinesFilled size="1rem" stroke={2} />
                </Tooltip>
                <Tooltip tooltip="Status">
                  <IconArrowBigRightLinesFilled size="1rem" stroke={2} />
                </Tooltip>
              </Th>
              <Th
                reversed={isReversed("votes")}
                sorted={isSorted("votes")}
                onSort={() => setSorting("votes")}
                w="4rem"
              >
                <Tooltip tooltip="Slack-reaktioita">
                  <IconThumbUpFilled size="1rem" stroke={2} />
                </Tooltip>
                <Tooltip tooltip="Slack-reaktioita">
                  <IconThumbUpFilled size="1rem" stroke={2} />
                </Tooltip>
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
