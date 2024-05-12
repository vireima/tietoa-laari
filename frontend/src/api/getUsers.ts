import axios from "axios";
import User from "../types/User";

export default async function getUsers() {
  const response = await axios.get("https://laari.up.railway.app/users");
  return response.data as User[];
}
