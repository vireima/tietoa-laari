import { FieldFilterInput } from "./FieldFilterInput";
import { Filter } from "./Filter";
import { FilterStructure } from "./FilterStructure";
import { QuantifierFilterInput } from "./QuantifierInput";

interface FilterInputProps<D> {
  filter: Filter<D>;
  onChange: (value: Filter<D>) => void;
  onDelete?: () => void;
  structure: FilterStructure<D>;
}

export function FilterInput<D>({
  filter,
  onChange,
  onDelete,
  structure,
}: FilterInputProps<D>) {
  console.log("FILTER", filter);
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
