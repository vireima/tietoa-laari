import {
  Portal,
  Paper,
  rem,
  Group,
  Burger,
  ThemeIcon,
  ActionIcon,
  useMantineColorScheme,
  Text,
  Tabs,
} from "@mantine/core";
import {
  IconChecklist,
  IconMoon,
  IconSeeding,
  IconSun,
  IconTargetArrow,
} from "@tabler/icons-react";
import TietoaIcon from "../assets/TietoaIcon";
import { useHeadroom, useHotkeys } from "@mantine/hooks";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ChannelSelect from "./ChannelSelect";

export default function Header({
  drawerOpened,
  drawerToggle,
}: {
  drawerOpened: boolean;
  drawerToggle: () => void;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const pinned = useHeadroom({ fixedAt: 150 });
  const navigate = useNavigate();

  useHotkeys([
    [
      "1",
      () =>
        navigate({
          pathname: `/laari`,
          search: `${searchParams}`,
        }),
    ],

    [
      "2",
      () =>
        navigate({
          pathname: `/jono`,
          search: `${searchParams}`,
        }),
    ],
    [
      "3",
      () =>
        navigate({
          pathname: `/maali`,
          search: `${searchParams}`,
        }),
    ],
    [
      "4",
      () =>
        navigate({
          pathname: `/arkisto`,
          search: `${searchParams}`,
        }),
    ],
    ["mod+T", () => toggleColorScheme()],
  ]);

  return (
    <Portal>
      <Paper
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          minHeight: "4rem",
          transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
          transition: "transform 700ms ease",
        }}
        radius={0}
      >
        <Group
          justify="space-between"
          pl={{ base: "1rem", sm: "1rem", lg: "2rem" }}
          pr={{ base: "1rem", sm: "1rem", lg: "2rem" }}
          mt="auto"
          mb="auto"
          mih="4rem"
          // pt="0.7rem"
          // bg="gray"
          // style={{ borderBottom: "2px solid var(--mantine-color-gray-3)" }}
        >
          <Group mb="auto" mt="auto">
            <Burger
              opened={drawerOpened}
              onClick={drawerToggle}
              color="primary"
              lineSize={3}
            />
            <ThemeIcon
              variant="transparent"
              radius="xl"
              size="lg"
              visibleFrom="xs"
            >
              <TietoaIcon />
            </ThemeIcon>
          </Group>

          <Tabs
            variant="pills"
            defaultValue="/laari"
            value={location.pathname}
            onChange={(val) =>
              navigate({
                pathname: `${val}`,
                search: `${searchParams}`,
              })
            }
          >
            <Tabs.List justify="center">
              <Tabs.Tab value="/laari" leftSection={<IconSeeding stroke={2} />}>
                <Text visibleFrom="xs">LAARI</Text>
              </Tabs.Tab>
              <Tabs.Tab
                value="/jono"
                leftSection={<IconChecklist stroke={2} />}
              >
                <Text visibleFrom="xs">JONO</Text>
              </Tabs.Tab>
              <Tabs.Tab
                value="/maali"
                leftSection={<IconTargetArrow stroke={2} />}
              >
                <Text visibleFrom="xs">MAALI</Text>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Group justify="flex-end" mb="auto" mt="auto">
            <ChannelSelect
              visibleFrom="md"
              placeholder="Slack-kanava..."
              value={searchParams.get("channel")}
              onChange={(value) => {
                value === null
                  ? searchParams.delete("channel")
                  : searchParams.set("channel", value);
                setSearchParams(searchParams);
              }}
            />

            <ActionIcon
              onClick={toggleColorScheme}
              variant="transparent"
              radius="xl"
              size="lg"
              visibleFrom="xs"
            >
              {colorScheme !== "dark" ? (
                <IconMoon size="1.2rem" stroke={2} />
              ) : (
                <IconSun size="1.2rem" stroke={2} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    </Portal>
  );
}
