import { Outlet } from "react-router-dom";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import Header from "../components/Header";
import FilterDrawer from "../components/FilterDrawer";
import { Box, LoadingOverlay } from "@mantine/core";
import useQueries from "../hooks/useQueries";
import useAuth from "../hooks/useAuth";

export default function TasklistLayout() {
  const { tasksQuery, usersQuery, channelsQuery } = useQueries();
  const [opened, { close, toggle }] = useDisclosure(false);
  useHotkeys([["F", () => toggle()]]);

  const [auth, setAuth] = useAuth();

  console.log("TasklistLayout, auth = ", auth);

  return (
    <Box>
      {/* <LoadingOverlay
        visible={
          tasksQuery.isLoading ||
          usersQuery.isLoading ||
          channelsQuery.isLoading
        }
        overlayProps={{ blur: 4 }}
        loaderProps={{ size: 50 }}
      /> */}
      {/* <FilterDrawer opened={opened} onClose={close} />
      <Header drawerOpened={opened} drawerToggle={toggle} /> */}
      <Outlet />
    </Box>
  );
}
