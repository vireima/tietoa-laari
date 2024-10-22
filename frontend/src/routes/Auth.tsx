import { Box } from "@mantine/core";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import config from "../config";
import SignIn from "../components/SignIn";

export default function Auth() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const code = search.get("code");

  console.log("auth:", auth);

  useEffect(() => {
    if (code !== null)
      axios
        .get(`https://${config.API_URL}/token?code=${code}`)
        .then((response) => {
          setAuth(response.data);
        })
        .then(() => navigate("/"))
        .catch((err) => console.error(`Error on /token: ${err}`));
  }, [code]);

  return <Box>{!code ? <SignIn /> : "Authing..."}</Box>;
}
