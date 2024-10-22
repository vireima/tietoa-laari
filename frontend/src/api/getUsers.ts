import axios from "axios";
import User from "../types/User";
import config from "../config";
import useAuth from "../hooks/useAuth";

export default async function getUsers() {
  const response = await axios.get(`https://${config.API_URL}/users`, {
    headers: { Authorization: `Bearer: ${useAuth()}` },
  });
  return response.data as User[];
}
export function userDisplayName(user: User | undefined) {
  return user?.profile.display_name || user?.name || "";
}
