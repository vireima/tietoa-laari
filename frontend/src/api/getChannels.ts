import axios from "axios";
import Channel from "../types/Channel";
import config from "../config";

// export default async function getChannels(tasks: InputTask[] | undefined) {
//   if (!tasks) return [];

//   const uniqueChannels = Array.from(
//     new Set(tasks?.map((task) => task.channel))
//   );

//   return await Promise.all(
//     uniqueChannels.map(async (channel) => {
//       console.log(`Fetching https://${config.API_URL}/channels/${channel}`);
//       const response = await axios.get(
//         `https://${config.API_URL}/channels/${channel}`,
//         { headers: { Authorization: `Bearer: ${useAuth()}` } }
//       );
//       return <Channel>response.data;
//     })
//   );
// }

export default async function getChannels({ queryKey }: any) {
  const [_key, auth] = queryKey;

  const response = await axios.get(`https://${config.API_URL}/channels`, {
    headers: { Authorization: `Bearer ${auth}` },
  });
  return response.data as Channel[];
}
