import axios from "axios";
import User from "../types/User";
import config from "../config";

export default async function getUsers({ queryKey }: any) {
  const [_key, auth] = queryKey;

  const response = await axios.get(`https://${config.API_URL}/users`, {
    headers: { Authorization: `Bearer ${auth}` },
  });
  return response.data as User[];
}
export function userDisplayName(user: User | undefined) {
  return user?.profile.display_name || user?.name || "";
}
