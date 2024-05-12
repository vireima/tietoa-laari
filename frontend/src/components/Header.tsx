import {
  Portal,
  Paper,
  rem,
  Group,
  Burger,
  ThemeIcon,
  Title,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import TietoaIcon from "../assets/TietoaIcon";
import { useHeadroom } from "@mantine/hooks";

export default function Header({
  drawerOpened,
  drawerToggle,
}: {
  drawerOpened: boolean;
  drawerToggle: () => void;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const pinned = useHeadroom({ fixedAt: 150 });
  return (
    <Portal>
      <Paper
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4rem",
          transform: `translate3d(0, ${pinned ? 0 : rem(-110)}, 0)`,
          transition: "transform 700ms ease",
        }}
        p={{ base: "0.2rem", sm: "1rem", lg: "2rem" }}
        pt="xs"
      >
        <Group grow>
          <Group>
            <Burger opened={drawerOpened} onClick={drawerToggle} />
            <ThemeIcon variant="default" radius="xl" size="lg">
              <TietoaIcon />
            </ThemeIcon>
            <Title>Laari</Title>
          </Group>
          <Group justify="flex-end">
            <ActionIcon
              onClick={toggleColorScheme}
              variant="filled"
              radius="xl"
              size="lg"
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
