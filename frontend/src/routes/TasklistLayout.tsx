import { Outlet, useNavigate } from "react-router-dom";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import Header from "../components/Header";
import FilterDrawer from "../components/FilterDrawer";
import {
  Box,
  Button,
  Text,
  Stack,
  Loader,
  Center,
  Alert,
  Anchor,
} from "@mantine/core";
import useQueries from "../hooks/useQueries";
import useAuth from "../hooks/useAuth";
import { notifications, useNotifications } from "@mantine/notifications";
import {
  IconAlertSmall,
  IconExclamationCircle,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";
import { useEffect } from "react";

export default function TasklistLayout() {
  // const notificationsStore = useNotifications();
  const navigate = useNavigate();
  const { tasksQuery, usersQuery, channelsQuery } = useQueries();

  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth]);

  // useEffect(() => {
  //   if (tasksQuery.isError || usersQuery.isError || channelsQuery.isError) {
  //     if (
  //       !notificationsStore.notifications.find(
  //         (notification) => notification.id === "error"
  //       )
  //     ) {
  //       notifications.show({
  //         id: "error",
  //         title: "Ehdotusten haku epännistui",
  //         color: "red",
  //         icon: <IconAlertSmall />,
  //         message: (
  //           <Stack gap="xs">
  //             <Text>{tasksQuery.error?.message}</Text>
  //             <Button
  //               color="red"
  //               onClick={() => {
  //                 navigate("/login");
  //                 notifications.clean();
  //               }}
  //             >
  //               Kirjaudu sisään
  //             </Button>
  //           </Stack>
  //         ),
  //       });
  //     }
  //   }
  // }, [tasksQuery.isError, usersQuery.isError, channelsQuery.isError]);

  return (
    <Box>
      {tasksQuery.isError || usersQuery.isError || channelsQuery.isError ? (
        <Center h="100vh">
          <Alert
            variant="light"
            title="Virhe"
            color="red"
            icon={<IconExclamationCircleFilled />}
          >
            <Text>Ehdotusten haku epäonnistui.</Text>
            <Text>
              Koita <Anchor href="/login">kirjautua uudelleen sisään</Anchor> ja
              pistä viestiä{" "}
              <Anchor href="slack://user?team=T1FB2571R&id=DCHJRD96D">
                @ville
              </Anchor>
              lle, jos se ei auta.
            </Text>
          </Alert>
        </Center>
      ) : tasksQuery.isLoading ? (
        <Center h="100vh">
          <Loader type="dots" color="gray.4" size="xl" />
        </Center>
      ) : (
        <Outlet />
      )}
    </Box>
  );
}
