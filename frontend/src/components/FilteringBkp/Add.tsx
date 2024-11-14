import { ActionIcon, Combobox, useCombobox } from "@mantine/core";
import { IconFilter, IconFilterPlus } from "@tabler/icons-react";
import { FieldFilter } from "./Filter";
import { FilterStructure } from "./ComponentTypes";

interface AddProps<T> {
  structure: FilterStructure<T>;
  onChange: (value: FieldFilter<T>["field"]) => void;
}

export default function Add<T>({ structure, onChange }: AddProps<T>) {
  const combobox = useCombobox();

  return (
    <Combobox
      store={combobox}
      width={100}
      withArrow
      withinPortal={false}
      onOptionSubmit={(value) => {
        onChange(value as FieldFilter<T>["field"]);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <ActionIcon
          size={"xs"}
          variant="transparent"
          onClick={() => combobox.toggleDropdown()}
        >
          <IconFilterPlus />
        </ActionIcon>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {structure.map((field) => (
            <Combobox.Option value={field.field}>{field.label}</Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
