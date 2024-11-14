import { DateTime } from "ts-luxon";
import { DateFilter } from "./Filter";
import { Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { DateOperator } from "./Operator";
import { ExtendedTask } from "../../types/Task";
import classes from "../../styles/FieldFilterInput.module.css";
import {
  IconCalendarPlus,
  IconCalendarRepeat,
  IconNumber30Small,
  IconNumber7Small,
} from "@tabler/icons-react";

interface DatePickerMenuProps {
  onChange: (value: DateTime) => void;
}

export function DatePickerMenu({ onChange }: DatePickerMenuProps) {
  return (
    <>
      <Menu.Item
        onClick={() => onChange(DateTime.now().startOf("week"))}
        leftSection={<IconNumber7Small />}
      >
        Viikon sisään
      </Menu.Item>

      <Menu.Item
        onClick={() => onChange(DateTime.now().startOf("month"))}
        leftSection={<IconNumber30Small />}
      >
        Tässä kuussa
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <DatePicker
          size="xs"
          onChange={(value) =>
            value ? onChange(DateTime.fromJSDate(value)) : null
          }
        />
      </Menu.Item>
    </>
  );
}

interface DateValueProps {
  value: DateTime;
  onChange: (value: DateTime) => void;
}

export function DateValue({ value, onChange }: DateValueProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Menu withinPortal={false} closeOnItemClick={false}>
      <Menu.Target>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className={`${classes.hover} ${classes.mid}`}
        >
          {value.setLocale("fi").toLocaleString()}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <DatePickerMenu onChange={onChange} />
      </Menu.Dropdown>
    </Menu>
  );
}

interface DateFieldNameProps {
  field: Extract<keyof ExtendedTask, string> | string;
}

function DateFieldName({ field }: DateFieldNameProps) {
  const [Icon, text] =
    field === "created"
      ? [IconCalendarPlus, "Ehdotettu"]
      : field === "modified"
      ? [IconCalendarRepeat, "Muokattu"]
      : [null, ""];

  return (
    <Group className={`${classes.left}`} gap="xs">
      {Icon ? <Icon stroke={1.5} size={18} /> : null}
      <Text fz="small">{text}</Text>
    </Group>
  );
}

interface DateFieldInputProps<D> {
  filter: DateFilter<D>;
  onChange: (f: DateFilter<D>) => void;
}

export function DateFieldInput<D>({
  filter,
  onChange,
}: DateFieldInputProps<D>) {
  return (
    <>
      <DateFieldName field={filter.field} />
      <DateOperator
        op={filter.op}
        onChange={(op) => onChange({ ...filter, op: op })}
      />
      <DateValue
        value={filter.value}
        onChange={(value) => onChange({ ...filter, value: value })}
      />
    </>
  );
}
