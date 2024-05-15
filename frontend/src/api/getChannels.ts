import axios from "axios";
import { InputTask } from "../types/Task";
import Channel from "../types/Channel";
import config from "../config";

export default async function getChannels(tasks: InputTask[] | undefined) {
  if (!tasks) return undefined;

  const uniqueChannels = Array.from(
    new Set(tasks?.map((task) => task.channel))
  );

  return await Promise.all(
    uniqueChannels.map(async (channel) => {
      console.log(
        `Fetching https://${config.RAILWAY_BACKEND_PRIVATE_DOMAIN}/channels/${channel}`
      );
      const response = await axios.get(
        `https://${config.RAILWAY_BACKEND_PRIVATE_DOMAIN}/channels/${channel}`
      );
      return <Channel>response.data;
    })
  );
}
