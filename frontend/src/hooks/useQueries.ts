import { useQuery } from "@tanstack/react-query";
import getChannels from "../api/getChannels";
import getTasks from "../api/getTasks";
import getUsers from "../api/getUsers";
import useAuth from "./useAuth";

export default function useQueries() {
  const [auth] = useAuth();

  const tasksQuery = useQuery({
    queryKey: ["tasks", auth],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 1,
    retry: false,
  });
  const usersQuery = useQuery({
    queryKey: ["users", auth],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
  const channelsQuery = useQuery({
    queryKey: ["channels", auth],
    queryFn: getChannels,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { tasksQuery, usersQuery, channelsQuery };
}
