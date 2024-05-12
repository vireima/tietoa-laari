import axios from "axios";
import User from "../types/User";

export default async function getUsers() {
  const response = await axios.get("https://laari.up.railway.app/users");
  return response.data as User[];
}

export function mapUserIDs(users: User[] | undefined) {
  return new Map<string, User>(users?.map((user) => [user.id, user]));
}

export function userDisplayName(user: User | undefined) {
  return user?.profile.display_name || user?.name || "";
}
