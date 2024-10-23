import {
  Alert,
  Anchor,
  Blockquote,
  Center,
  Paper,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let errorTitle = "";
  let errorComponent;

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} "${error.statusText}"`;
    errorComponent = error.data;
  } else if (error instanceof Error) {
    errorTitle = error.name;
    errorComponent = error.message;
  } else if (typeof error === "string") {
    errorComponent = error;
  } else {
    errorComponent = "Tuntematon virhe :(";
  }

  return (
    <Center h="100vh">
      <Alert
        variant="light"
        title={errorTitle ? `Virhe: ${errorTitle}` : "Virhe"}
        color="red"
        icon={<IconExclamationCircleFilled />}
      >
        <Text fs="italic">{errorComponent}</Text>
        <Text mt="xs">
          <Anchor href="/">Tästä etusivulle</Anchor>.
        </Text>
      </Alert>
    </Center>
    // <Paper>
    //   <Center h={400}>
    //     <Stack>
    //       <Title>Virhe!</Title>
    //       {errorComponent}
    //       <Anchor href="/">Tästä etusivulle</Anchor>
    //     </Stack>
    //   </Center>
    // </Paper>
  );
}
