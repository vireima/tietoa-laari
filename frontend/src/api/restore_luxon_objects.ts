import { DateTime, Duration } from "ts-luxon";

export function restore_luxon_objects(obj: any) {
  for (const k in obj) {
    if (!obj.hasOwnProperty(k)) {
      continue;
    }

    if (typeof obj[k] === "object" && obj[k] !== null) {
      if (obj[k].hasOwnProperty("_isLuxonDateTime")) {
        obj[k] = DateTime.fromMillis(obj[k]._ts);
        continue;
      }

      if (obj[k].hasOwnProperty("_isLuxonDuration")) {
        obj[k] = Duration.fromObject(obj[k]._values);
        continue;
      }

      restore_luxon_objects(obj[k]);
    }
  }
}
