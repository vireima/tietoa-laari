import { Filter } from "./Filter";
import { FilterStructure } from "./FilterStructure";

interface FieldFilterInputProps<D> {
  filter: Filter<D>;
  onChange: (value: Filter<D>) => void;
  onDelete?: () => void;
  structure: FilterStructure<D>;
}

export function FieldFilterInput<D>({}: FieldFilterInputProps<D>) {
  return <>FIELD</>;
}
