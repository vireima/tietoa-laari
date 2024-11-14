import { Outlet, useNavigate } from "react-router-dom";
import { Box, Text, Loader, Center, Alert, Anchor } from "@mantine/core";
import useQueries from "../hooks/useQueries";
import useAuth from "../hooks/useAuth";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { useEffect } from "react";

export default function TasklistLayout() {
  const navigate = useNavigate();
  const { tasksQuery, usersQuery, channelsQuery } = useQueries();

  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth]);

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
