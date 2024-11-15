import useAuth from "./useAuth";
import * as jose from "jose";
import useMappedQueries from "./useMappedQueries";
import { IDToken } from "../types/IDToken";

export default function useAuthenticatedID() {
  const [auth] = useAuth();
  const { usersMap } = useMappedQueries();

  if (!auth) return undefined;

  const id_token = jose.decodeJwt<IDToken>(auth);

  return usersMap.get(id_token.client_id);
}
