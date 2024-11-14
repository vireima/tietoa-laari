import { Button, Group, Text } from "@mantine/core";
import { AndFilter, Filter, OrFilter } from "./Filter";
import { FilterInput, FilterStructure } from "./ComponentTypes";
import { restore_luxon_objects } from "../../api/restore_luxon_objects";
import Add from "./Add";

export interface QuantifierFilterInputProps<D> {
  filter: AndFilter<D> | OrFilter<D>;
  onChange: (value: Filter<D>) => void;
  onDelete?: () => void;
  structure: FilterStructure<D>;
}

export function QuantifierFilterInput<D>({
  onChange,
  onDelete,
  structure,
  filter,
}: QuantifierFilterInputProps<D>) {
  const ops = structuredClone(filter.operands);
  restore_luxon_objects(ops);

  return (
    <Group gap="xs">
      <Button
        variant="transparent"
        size="compact-lg"
        onClick={() => {
          onChange({
            type: filter.type === "and" ? "or" : "and",
            operands: ops,
          });
        }}
      >
        {filter.type === "and" ? "∀" : "∃"}
      </Button>
      <Text>{"("}</Text>
      {filter.operands.map((op, index) => (
        <FilterInput
          structure={structure}
          filter={op}
          onChange={(value) => {
            ops[index] = value;
            onChange({
              type: filter.type,
              operands: ops,
            });
          }}
          onDelete={() => {
            ops.splice(index, 1);
            if (ops.length >= 1)
              onChange({
                type: filter.type,
                operands: ops,
              });
            else if (onDelete) onDelete();
          }}
        />
      ))}
      <Add
        structure={structure}
        onChange={(value) => {
          ops.push({
            type: "field",
            field: value,
            field_type: "string",
            op: "is",
            value: "",
          });
          onChange({
            type: filter.type,
            operands: ops,
          });
        }}
      />
      <Text>{")"}</Text>
    </Group>
  );
}
