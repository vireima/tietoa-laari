import { Box, Stack, Text } from "@mantine/core";
import { AuthProvider, useAuth } from "oidc-react";

const oidcConfig = {
  authority: "https://slack.com",
  client_id: "49376177059.7028841200644",
  redirect_uri: "https://laari.up.railway.app",
  response_type: "code",
  scope: "openid profile email",
};

function AuthComponent() {
  const auth = useAuth();

  console.log(auth.userData);
  console.log(auth.userData?.profile);

  return (
    <Stack>
      <Text>Access: {auth.userData?.access_token}</Text>
      <Text>Name: {auth.userData?.profile.name}</Text>
    </Stack>
  );
}

export default function Secure() {
  return (
    <AuthProvider {...oidcConfig}>
      <AuthComponent />
    </AuthProvider>
  );
}
