import { useQuery } from "@tanstack/react-query";
import { ExtendedTask } from "../types/Task";

export default function useComments(task: ExtendedTask) {
  const channelsQuery = useQuery({
    queryKey: ["comments", task.channel?.id, task.ts],
    queryFn: () => getChannels(tasksQuery.data),
    enabled: !!usersQuery.data,
    staleTime: 1000 * 60 * 5,
  });
}
