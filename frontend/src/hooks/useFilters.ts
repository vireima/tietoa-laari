import { Filter } from "../types/Filter";
import { useSearchParams } from "react-router-dom";
import { DateTime } from "ts-luxon";
import { Status } from "../types/Status";

export default function useFilters(override: Filter) {
  // const [filters, setFilters] = useState<Filter>(initialFilters ?? {});
  const [searchParams] = useSearchParams();

  // console.warn(initialFilters);

  const after = searchParams.get("after");
  const afterDateTime = after
    ? DateTime.fromISO(after)
    : DateTime.fromSeconds(0);
  const priority = Number(searchParams.get("priority")) || -1000;

  const filters = override;

  const combined: Filter = {
    status: searchParams
      .getAll("status")
      .concat(filters?.status ?? []) as Status[],
    channel: searchParams.getAll("channel").concat(filters?.channel ?? []),
    author: searchParams.getAll("author").concat(filters?.author ?? []),
    assignees: searchParams.getAll("assignee").concat(filters?.assignees ?? []),
    after: filters?.after
      ? DateTime.max(afterDateTime, filters.after)
      : afterDateTime,
    priority: filters?.priority
      ? Math.max(priority, filters.priority)
      : priority,
    tags: searchParams.getAll("tag").concat(filters?.tags ?? []),
    archived:
      searchParams.get("archived") !== null
        ? Boolean(searchParams.get("archived"))
        : filters.archived,
  };

  return { filters: combined };
}
