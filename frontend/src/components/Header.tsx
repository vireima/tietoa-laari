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
  Stack,
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
          minHeight: "2rem",
          transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
          transition: "transform 700ms ease",
        }}
        radius={0}
      >
        <Stack gap="xs">
          <Group
            justify="space-between"
            pl={{ base: "0.2rem", sm: "1rem", lg: "2rem" }}
            pr={{ base: "0.2rem", sm: "1rem", lg: "2rem" }}
            pt="0.7rem"
            // bg="gray"
            style={{ borderBottom: "2px solid var(--mantine-color-gray-3)" }}
          >
            <Group mb="0.7rem">
              <Burger opened={drawerOpened} onClick={drawerToggle} />
              <ThemeIcon
                variant="default"
                radius="xl"
                size="lg"
                visibleFrom="xs"
              >
                <TietoaIcon />
              </ThemeIcon>
            </Group>

            <Tabs
              variant="default"
              defaultValue="/laari"
              value={location.pathname}
              onChange={(val) =>
                navigate({
                  pathname: `${val}`,
                  search: `${searchParams}`,
                })
              }
              style={{
                position: "relative",
                bottom: -2,
              }}
            >
              <Tabs.List justify="center">
                <Tabs.Tab
                  value="/laari"
                  leftSection={<IconSeeding stroke={1} />}
                >
                  <Text visibleFrom="xs">LAARI</Text>
                </Tabs.Tab>
                <Tabs.Tab
                  value="/jono"
                  leftSection={<IconChecklist stroke={1} />}
                >
                  <Text visibleFrom="xs">JONO</Text>
                </Tabs.Tab>
                <Tabs.Tab
                  value="/maali"
                  leftSection={<IconTargetArrow stroke={1} />}
                >
                  <Text visibleFrom="xs">MAALI</Text>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Group justify="flex-end" mb="0.7rem">
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
                variant="filled"
                radius="xl"
                size="lg"
                visibleFrom="xs"
              >
                {colorScheme !== "dark" ? (
                  <IconMoon size="1.2rem" />
                ) : (
                  <IconSun size="1.2rem" />
                )}
              </ActionIcon>
            </Group>
          </Group>
        </Stack>
      </Paper>
    </Portal>
  );
}
