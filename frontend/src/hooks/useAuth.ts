import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { DateTime } from "ts-luxon";

export default function useAuth() {
  const [cookies, setCookie] = useCookies(["auth"]);
  const [auth, setAuth] = useState<string | null>(null);

  useEffect(() => {
    if (!cookies.auth) {
      setCookie("auth", true);
    }
  }, [auth, cookies, setCookie]);

  const ret: [string | null, typeof setAuth] = [auth, setAuth];
  return ret;
}

// export default async function getTasks() {
//     const response = await axios.get(
//       `https://${config.API_URL}/tasks?include_archived=true`
//     );
//     return response.data as InputTask[];
//   }