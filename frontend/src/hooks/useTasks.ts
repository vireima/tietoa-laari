import { useFetch } from "@mantine/hooks";
import { Task } from "../types/Task";

export default function useTasks() {
  const { data, loading, error, refetch, abort } = useFetch<Task[]>(
    "https://laari.up.railway.app/tasks"
  );

  return {
    tasks: data,
    loading,
    error,
    refetch,
    abort,
  };
}
