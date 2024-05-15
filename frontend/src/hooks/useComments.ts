import { useQuery } from "@tanstack/react-query";
import { ExtendedTask } from "../types/Task";
import getComments from "../api/getComments";

export default function useComments(task: ExtendedTask) {
  return useQuery({
    queryKey: ["comments", task.channel?.id, task.ts],
    queryFn: () => getComments(task),
    staleTime: 1000 * 60 * 2,
  });
}
