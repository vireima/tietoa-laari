import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function useAuth() {
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const [auth, setAuth_] = useState<string | null>(cookies.auth ?? null);

  const setAuth = (state: string | null) => {
    setAuth_(state);

    if (state === null) {
      removeCookie("auth");
    } else {
      setCookie("auth", state);
    }
  };

  const ret: [string | null, typeof setAuth] = [auth, setAuth];
  return ret;
}

// export default async function getTasks() {
//     const response = await axios.get(
//       `https://${config.API_URL}/tasks?include_archived=true`
//     );
//     return response.data as InputTask[];
//   }
