import { Anchor, Blockquote, Center, Paper, Stack, Title } from "@mantine/core";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  let errorComponent;

  if (isRouteErrorResponse(error)) {
    errorComponent = (
      <Blockquote cite={`${error.status} ${error.statusText}`}>
        {error.data}
      </Blockquote>
    );
  } else if (error instanceof Error) {
    errorComponent = (
      <Blockquote cite={`${error.name}`}>{error.message}</Blockquote>
    );
  } else if (typeof error === "string") {
    errorComponent = <Blockquote>{error}</Blockquote>;
  } else {
    errorComponent = <Blockquote>{"Tuntematon virhe :("}</Blockquote>;
  }

  return (
    <Paper>
      <Center h={400}>
        <Stack>
          <Title>Virhe!</Title>
          {errorComponent}
          <Anchor href="/">Tästä etusivulle</Anchor>
        </Stack>
      </Center>
    </Paper>
  );
}
