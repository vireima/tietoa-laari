import { useQuery } from "@tanstack/react-query";
import getTask from "../api/getTask";
import useAuth from "./useAuth";

export default function useSingleTaskQuery(channel: string, ts: string) {
  const [auth] = useAuth();

  const query = useQuery({
    queryKey: ["single_task", auth, channel, ts],
    queryFn: getTask,
  });
  return { query };
}
