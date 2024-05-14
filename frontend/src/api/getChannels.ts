import axios from "axios";
import { InputTask } from "../types/Task";
import Channel from "../types/Channel";

export default async function getChannels(tasks: InputTask[] | undefined) {
  if (!tasks) return undefined;

  const uniqueChannels = Array.from(
    new Set(tasks?.map((task) => task.channel))
  );

  return await Promise.all(
    uniqueChannels.map(async (channel) => {
      console.log(`Fetching https://laari.up.railway.app/channels/${channel}`);
      const response = await axios.get(
        `https://laari.up.railway.app/channels/${channel}`
      );
      return <Channel>response.data;
    })
  );
}
