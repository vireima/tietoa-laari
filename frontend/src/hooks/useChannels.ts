import { Task } from "../types/Task";
import { useAsyncFn } from "react-use";
import axios from "axios";
import { useEffect } from "react";
import Channel from "../types/Channel";

export default function useChannels(tasks: Task[] | null) {
  const uniqueChannels = Array.from(
    new Set(tasks?.map((task) => task.channel))
  );

  const [state, doFetch] = useAsyncFn(async () => {
    console.log("FETCHING CHANNELS; uniq = ", uniqueChannels);
    try {
      return await Promise.all(
        uniqueChannels.map(async (channel) => {
          console.log(
            `Fetching https://laari.up.railway.app/channels/${channel}`
          );
          const response = await axios.get(
            `https://laari.up.railway.app/channels/${channel}`
          );
          return <Channel>response.data;
        })
      );
    } catch (error) {
      console.error("B", error);
    }
  }, [uniqueChannels.length]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return {
    channels: state.value ? state.value : null,
    loading: state.loading,
    error: state.error,
  };
}
