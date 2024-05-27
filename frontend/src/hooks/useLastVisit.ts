import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { DateTime } from "ts-luxon";

export default function useLastVisit() {
  const [cookies, setCookie] = useCookies(["lastvisit"]);
  const [lastVisit] = useState<DateTime>(
    cookies.lastvisit
      ? DateTime.fromISO(cookies.lastvisit).setLocale("fi-FI")
      : DateTime.now().setLocale("fi-FI")
  );

  useEffect(() => {
    if (!cookies.lastvisit || lastVisit > cookies.lastvisit) {
      setCookie("lastvisit", DateTime.now().toISO());
    }
  }, [lastVisit, cookies, setCookie]);

  return lastVisit;
}
