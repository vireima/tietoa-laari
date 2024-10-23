import axios from "axios";
import User from "../types/User";
import config from "../config";
import useAuth from "../hooks/useAuth";

export default async function getToken(code: string) {
  const response = await axios.get(
    `https://${config.API_URL}/token?code=${code}`
  );

  const [auth, setAuth] = useAuth();
  setAuth(response.data);

  return response.data as User[];
}
