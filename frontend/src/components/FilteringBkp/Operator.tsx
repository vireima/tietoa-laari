import { Button, Combobox, useCombobox } from "@mantine/core";
import { FieldFilter } from "./Filter";
import classes from "../../styles/FieldFilterInput.module.css";

interface OperatorProps<T> {
  value: FieldFilter<T>["op"];
  onChange: (value: FieldFilter<T>["op"]) => void;
}

export default function Operator<T>({ value, onChange }: OperatorProps<T>) {
  const combobox = useCombobox();

  return (
    <Combobox
      store={combobox}
      width={100}
      withArrow
      withinPortal={false}
      onOptionSubmit={(value) => {
        onChange(value as FieldFilter<T>["op"]);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          className={classes.hover}
          variant="transparent"
          onClick={() => combobox.toggleDropdown()}
          size="compact-xs"
        >
          {value}
        </Button>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Option value="is">on</Combobox.Option>
          <Combobox.Option value="contains">sisältää</Combobox.Option>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
