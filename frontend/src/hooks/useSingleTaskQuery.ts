import { useQuery } from "@tanstack/react-query";
import getTask from "../api/getTask";

export default function useSingleTaskQuery(channel: string, ts: string) {
  const query = useQuery({
    queryKey: ["single_task", channel, ts],
    queryFn: () => getTask(channel, ts),
  });
  return { query };
}
