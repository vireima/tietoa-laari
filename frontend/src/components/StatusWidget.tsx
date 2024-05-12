import { Select } from "@mantine/core";
import { Status } from "../types/Status";

export default function StatusWidget({
  status,
  setStatus,
}: {
  status: Status;
  setStatus: (val: string | null) => void;
}) {
  return (
    <Select
      value={status}
      onChange={setStatus}
      variant="unstyled"
      data={["todo", "in progress", "done", "closed"]}
    />
  );
}
