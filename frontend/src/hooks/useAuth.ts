import { useCookies } from "react-cookie";
import * as jose from "jose";
import { IDToken } from "../types/IDToken";

export default function useAuth() {
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  const setAuth = (state: string | null) => {
    if (state === null) {
      removeCookie("auth");
    } else {
      const id_token = jose.decodeJwt<IDToken>(state);

      setCookie("auth", state, {
        secure: true,
        expires: new Date(id_token.exp * 1000),
      });
    }
  };

  const ret: [string | null, typeof setAuth] = [cookies.auth ?? null, setAuth];
  return ret;
}
