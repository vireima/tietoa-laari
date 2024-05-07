import { useFetch } from "@mantine/hooks";
import User from "../types/User";

export default function useUsers() {
  const { data, loading, error, refetch, abort } = useFetch<User[]>(
    "https://laari.up.railway.app/users"
  );

  return {
    users: data,
    loading,
    error,
    refetch,
    abort,
  };
}
