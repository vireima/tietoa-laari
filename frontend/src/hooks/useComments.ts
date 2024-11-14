import { useQuery } from "@tanstack/react-query";
import { ExtendedTask } from "../types/Task";
import getComments from "../api/getComments";
import useAuth from "./useAuth";

export default function useComments(task: ExtendedTask) {
  const [auth, setAuth] = useAuth();

  return useQuery({
    queryKey: ["comments", task.channel?.id, task.ts, auth],
    queryFn: () => getComments(task, auth),
    staleTime: 1000 * 60 * 2,
  });
}
