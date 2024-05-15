import { useQuery } from "@tanstack/react-query";
import getChannels from "../api/getChannels";
import getTasks from "../api/getTasks";
import getUsers from "../api/getUsers";

export default function useQueries() {
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 1,
  });
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 15,
  });
  const channelsQuery = useQuery({
    queryKey: [
      "channels",
      new Set(tasksQuery.data?.map((task) => task.channel)),
    ],
    queryFn: () => getChannels(tasksQuery.data),
    enabled: !!usersQuery.data,
    staleTime: 1000 * 60 * 5,
  });

  return { tasksQuery, usersQuery, channelsQuery };
}
