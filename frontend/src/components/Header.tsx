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
import { useHeadroom } from "@mantine/hooks";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const pinned = useHeadroom({ fixedAt: 150 });
  const navigate = useNavigate();
  const { status } = useParams();

  console.log("status =", status);

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
        p={{ base: "0.2rem", sm: "1rem", lg: "2rem" }}
        pt="xs"
      >
        <Group justify="space-between">
          <Group>
            <Burger opened={drawerOpened} onClick={drawerToggle} />
            <ThemeIcon variant="default" radius="xl" size="lg" visibleFrom="xs">
              <TietoaIcon />
            </ThemeIcon>
            {/* <Title>Laari</Title> */}
          </Group>
          <Tabs
            variant="outline"
            defaultValue="laari"
            value={status}
            onChange={(val) =>
              navigate({
                pathname: `/${val}`,
                search: `${searchParams}`,
              })
            }
          >
            <Tabs.List justify="center">
              <Tabs.Tab value="laari" leftSection={<IconSeeding stroke={1} />}>
                <Text visibleFrom="xs">LAARI</Text>
              </Tabs.Tab>
              <Tabs.Tab value="jono" leftSection={<IconChecklist stroke={1} />}>
                <Text visibleFrom="xs">JONO</Text>
              </Tabs.Tab>
              <Tabs.Tab
                value="maali"
                leftSection={<IconTargetArrow stroke={1} />}
              >
                <Text visibleFrom="xs">MAALI</Text>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Group justify="flex-end">
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
      </Paper>
    </Portal>
  );
}
