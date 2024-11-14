interface FilterInputFieldDescription<T> {
  field: Extract<keyof T, string> | string;
  label: string;
  type: "string" | "datetime" | "array";
}

export type FilterStructure<D> = FilterInputFieldDescription<D>[];
