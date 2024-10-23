import { Center, Loader, Paper, Title, Text, Stack } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import config from "../config";
import SlackSignIn from "../components/SlackSignIn";

export default function Login() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const code = search.get("code");
  const [error, setError] = useState(false);

  console.log("auth (Auth.tsx):", auth);

  useEffect(() => {
    if (code !== null) {
      axios
        .get(`https://${config.API_URL}/token?code=${code}`)
        .then((response) => {
          console.log("response from /token: ", response.data);

          setAuth(response.data);
          setError(false);
        })
        .then(() => navigate("/"))
        .catch((err) => {
          setError(true);
          console.error(`Error on /token: ${err}`);
        });
    }
  }, [code]);

  return (
    <Center h="80vh">
      <Stack>
        <Title>Laari</Title>
        <Text>Kirjaudu sisään Slack-tunnuksilla:</Text>
        {!code || error ? <SlackSignIn /> : <Loader type="dots" />}
      </Stack>
    </Center>
  );
}
