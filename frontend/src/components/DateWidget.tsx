import { DateInput } from "@mantine/dates";
import { DateTime } from "ts-luxon";
import { IconCalendarUp } from "@tabler/icons-react";

export default function StatusWidget({ date }: { date: DateTime }) {
  return (
    <DateInput
      value={date.toJSDate()}
      disabled
      leftSection={<IconCalendarUp size={"1rem"} />}
    />
  );
}
