import { Box } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import config from "../config";
import SignIn from "../components/SignIn";

export default function Auth() {
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
        // .then(() => setTimeout(() => navigate("/"), 2000))
        .catch((err) => {
          setError(true);
          console.error(`Error on /token: ${err}`);
        });
    }
  }, [code]);

  return <Box>{!code || error ? <SignIn /> : "Authing..."}</Box>;
}
