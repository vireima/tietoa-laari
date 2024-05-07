import { useState } from "react";
import { Task } from "../types/Task";
import { useAsyncFn } from "react-use";
import axios from "axios";
import { useSetState } from "@mantine/hooks";

export default function useTask(defaultTask: Task) {
  const [task, setTask] = useSetState(defaultTask);
  const [state, update] = useAsyncFn(async () => {
    console.log(`Sending request to ${task._id}`);
    const response = await axios.patch(
      "https://laari.up.railway.app/tasks",
      task
    );
    const data = await response.data();
    console.log(data);
    setTask(data);
    return data;
  }, [task]);

  return {
    value: task,
    setTask,
    update,
    loading: state.loading,
    error: state.error,
  };
}
