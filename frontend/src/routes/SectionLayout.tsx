import { Outlet } from "react-router-dom";
import { InputTask } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import Header from "../components/Header";
import FilterDrawer from "../components/FilterDrawer";
import { Box, LoadingOverlay } from "@mantine/core";
import useQueries from "../hooks/useQueries";

export interface TaskDataOutletContext {
  tasks: InputTask[] | null;
  users: User[] | null;
  channels: Channel[] | null;
}

export default function SectionLayout() {
  const { tasksQuery, usersQuery, channelsQuery } = useQueries();
  const [opened, { close, toggle }] = useDisclosure(false);
  useHotkeys([["F", () => toggle()]]);

  return (
    <Box>
      <LoadingOverlay
        visible={
          tasksQuery.isLoading ||
          usersQuery.isLoading ||
          channelsQuery.isLoading
        }
        overlayProps={{ blur: 4 }}
        loaderProps={{ size: 50 }}
      />
      <FilterDrawer opened={opened} onClose={close} />
      <Header drawerOpened={opened} drawerToggle={toggle} />
      <Outlet />
    </Box>
  );
}
