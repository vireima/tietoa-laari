import {
  Box,
  Button,
  ActionIcon,
  Select,
  TextInput,
  Group,
  Text,
  MantineSize,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import {
  ArrayFilter,
  DateFilter,
  FieldFilter,
  Filter,
  StringFilter,
} from "./Filter";
import { DateTime, Duration } from "ts-luxon";
import { DateInput } from "@mantine/dates";
import { restore_luxon_objects } from "../../api/restore_luxon_objects";
import classes from "../../styles/FieldFilterInput.module.css";
import Operator from "./Operator";
import Add from "./Add";
import { QuantifierFilterInput } from "./QuantifierInput";

const select_props = {
  className: classes.select,
  size: "xs",
  variant: "unstyled",
};
const input_props = {
  className: classes.select,
  size: "xs",
  variant: "unstyled",
};
const date_props = {
  className: classes.select,
  size: "xs" as MantineSize,
  variant: "unstyled",
};

interface FilterInputFieldDescription<T> {
  field: Extract<keyof T, string> | string;
  label: string;
  type: "string" | "datetime" | "array";
}

export type FilterStructure<D> = FilterInputFieldDescription<D>[];

interface FilterInputProps<D> {
  filter: Filter<D>;
  onChange: (value: Filter<D>) => void;
  onDelete?: () => void;
  structure: FilterStructure<D>;
}

interface FieldFilterInputProps<D> extends FilterInputProps<D> {
  filter: FieldFilter<D>;
}

interface StringFieldFilterInputProps<D> extends FieldFilterInputProps<D> {
  filter: StringFilter<D>;
}

interface DateFieldFilterInputProps<D> extends FieldFilterInputProps<D> {
  filter: DateFilter<D>;
}

interface ArrayFieldFilterInputProps<D> extends FieldFilterInputProps<D> {
  filter: ArrayFilter<D>;
}

export function FilterInput<D>({
  filter,
  onChange,
  onDelete,
  structure,
}: FilterInputProps<D>) {
  if (filter.type === "and" || filter.type === "or") {
    return (
      <QuantifierFilterInput
        filter={filter}
        structure={structure}
        onChange={onChange}
        onDelete={onDelete}
      />
    );
  } else if (filter.type === "field") {
    return (
      <FieldFilterInput
        structure={structure}
        filter={filter}
        onChange={onChange}
        onDelete={onDelete}
      />
    );
  }

  return <></>;
}

function default_filter_by_type<D>(
  field_type: "string",
  field?: string
): StringFilter<D>;
function default_filter_by_type<D>(
  field_type: "datetime",
  field?: string
): DateFilter<D>;
function default_filter_by_type<D>(
  field_type: "array",
  field?: string
): ArrayFilter<D>;
function default_filter_by_type<D>(
  field_type: FieldFilter<D>["field_type"],
  field?: string
): FieldFilter<D>;
function default_filter_by_type<D>(
  field_type: FieldFilter<D>["field_type"],
  field?: string
): FieldFilter<D> {
  const common: Partial<FieldFilter<D>> = {
    type: "field",
    field: field ? field : "",
  };

  if (field_type === "string")
    return {
      type: "field",
      field: field ? field : "",
      field_type: "string",
      op: "contains",
      value: "",
    };
  else if (field_type === "datetime")
    return {
      type: "field",
      field: field ? field : "",
      field_type: "datetime",
      op: "after",
      value: DateTime.now().minus({ days: 7 }),
    };
  else
    return {
      type: "field",
      field: field ? field : "",
      field_type: "array",
      op: "has",
      value: [],
    };
}

function filter_by_field<D>(
  field: FieldFilter<D>["field"],
  structure: FilterStructure<D>
) {
  const x = structure.find((val) => val.field === field);
}

export function FieldFilterInput<D>({
  filter,
  onChange,
  onDelete,
  structure,
}: FieldFilterInputProps<D>) {
  const props = {
    onChange: (value: Filter<D>) => {
      onChange(value);
    },
    onDelete,
    structure,
  };

  const default_value_by_field_type = (value: string) => {
    const new_desc = structure.find(
      (field_description) => field_description.field === value
    );

    if (new_desc) {
      onChange(default_filter_by_type(new_desc.type, new_desc.field));
    }
  };

  return (
    <Group gap="xs" className={classes.field}>
      <Text>{filter.field}</Text>
      {/* {...select_props}
        variant="unstyled"
        data={structure.map(({ field, label }) => ({
          value: field,
          label: label,
        }))}
        value={filter.field}
        onChange={(value) => (value ? default_value_by_field_type(value) : {})}
      /> */}
      {filter.field_type === "string" ? (
        <StringFieldFilterInput filter={filter} {...props} />
      ) : filter.field_type === "datetime" ? (
        <DateFieldFilterInput filter={filter} {...props} />
      ) : filter.field_type === "array" ? (
        <ArrayFieldFilterInput filter={filter} {...props} />
      ) : (
        <></>
      )}
      <ActionIcon
        size={"xs"}
        variant="transparent"
        onClick={() => (onDelete ? onDelete() : null)}
      >
        <IconX />
      </ActionIcon>
    </Group>
  );
}

export function StringFieldFilterInput<D>({
  filter,
  onChange,
  onDelete,
  structure,
}: StringFieldFilterInputProps<D>) {
  return (
    <>
      <Operator
        value={filter.op}
        onChange={(value) =>
          onChange({
            type: filter.type,
            field: filter.field,

            field_type: filter.field_type,
            op: value as "is" | "contains",
            value: filter.value,
          })
        }
      />
      {/* <Select
        {...select_props}
        variant="unstyled"
        data={["is", "contains"]}
        value={filter.op}
        onChange={(value) =>
          value
            ? onChange({
                type: filter.type,
                field: filter.field,

                field_type: filter.field_type,
                op: value as "is" | "contains",
                value: filter.value,
              })
            : {}
        }
      /> */}
      <TextInput
        {...input_props}
        value={filter.value}
        h={20}
        onChange={(e) => {
          onChange({
            type: filter.type,
            field: filter.field,

            field_type: filter.field_type,
            op: filter.op,
            value: e.currentTarget.value,
          });
        }}
      />
    </>
  );
}

export function DateFieldFilterInput<D>({
  filter,
  onChange,
  onDelete,
  structure,
}: DateFieldFilterInputProps<D>) {
  return (
    <Group gap="xs">
      <Select
        {...select_props}
        data={["before", "after", "at"]}
        value={filter.op}
        onChange={(value) =>
          value
            ? onChange({
                type: filter.type,
                field: filter.field,

                field_type: filter.field_type,
                op: value as "before" | "after" | "at",
                value: filter.value,
              })
            : {}
        }
      />
      <DateInput
        {...date_props}
        value={filter.value.toJSDate()}
        onChange={(value) =>
          onChange({
            type: filter.type,
            field: filter.field,

            field_type: filter.field_type,
            op: filter.op,
            value: value ? DateTime.fromJSDate(value) : DateTime.now(),
          })
        }
      />
      {/* <TextInput
    value={filter.value}
    onChange={(e) => {
      onChange({
        type: filter.type,
        field: filter.field,

        field_type: filter.field_type,
        op: filter.op,
        value: e.currentTarget.value,
      });
    }} */}
    </Group>
  );
}

export function ArrayFieldFilterInput<D>({
  filter,
  onChange,
  onDelete,
  structure,
}: ArrayFieldFilterInputProps<D>) {
  return <>A</>;
}
