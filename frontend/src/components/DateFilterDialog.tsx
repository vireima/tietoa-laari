import {
  Popover,
  ActionIcon,
  Button,
  Text,
  Divider,
  Group,
  Stack,
  Center,
} from "@mantine/core";
import { IconCalendarOff, IconCalendarTime } from "@tabler/icons-react";
import { DateTime } from "ts-luxon";
import { DatePicker } from "@mantine/dates";

interface DateFilterDialogProps {
  date: DateTime | undefined;
  onChange: (new_date: DateTime | undefined) => void;
}

export default function DateFilterDialog({
  date,
  onChange,
}: DateFilterDialogProps) {
  return (
    <Popover shadow="lg">
      <Popover.Target>
        <ActionIcon variant="transparent">
          <IconCalendarTime stroke={1.6} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Text>Suodata ehdotuksia viimeisimmän muokkausajan perusteella</Text>
          <Group grow>
            <Button
              onClick={() => onChange(DateTime.now().minus({ days: 7 }))}
              variant="light"
              size="compact-sm"
            >
              Tämä viikko
            </Button>
            <Button
              onClick={() => onChange(DateTime.now().set({ day: 1 }))}
              variant="light"
              size="compact-sm"
            >
              Tämä kuukausi
            </Button>
            <Button
              onClick={() => onChange(undefined)}
              variant="light"
              size="compact-sm"
            >
              Nollaa
            </Button>
          </Group>
          <Divider />
          <Center>
            <DatePicker
              size="sm"
              allowDeselect
              value={date ? date.toJSDate() : null}
              onChange={(value) =>
                onChange(value ? DateTime.fromJSDate(value) : undefined)
              }
            />
          </Center>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
