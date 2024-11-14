import {
  Button,
  Combobox,
  rem,
  Select,
  UnstyledButton,
  useCombobox,
} from "@mantine/core";
import { ExtendedTask } from "../../types/Task";
import { DateFilter, FieldFilter } from "./Filter";
import classes from "../../styles/FieldFilterInput.module.css";
import {
  Icon12Hours,
  IconArrowLeftBar,
  IconArrowRightBar,
} from "@tabler/icons-react";

interface OperatorProps {
  op: DateFilter<ExtendedTask>["op"];
  onChange: (op: DateFilter<ExtendedTask>["op"]) => void;
}

export function DateOperator({ op, onChange }: OperatorProps) {
  const combobox = useCombobox();

  const text =
    op === "after"
      ? "myöhemmin kuin"
      : op === "before"
      ? "aikaisemmin kuin"
      : "tasan";

  return (
    <Combobox
      store={combobox}
      width={140}
      withArrow
      withinPortal={false}
      onOptionSubmit={(value) => {
        onChange(value as DateFilter<ExtendedTask>["op"]);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <UnstyledButton
          className={`${classes.hover} ${classes.mid}`}
          onClick={() => combobox.toggleDropdown()}
          onBlur={() => combobox.closeDropdown()}
        >
          {text}
        </UnstyledButton>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Option value="after">myöhemmin kuin</Combobox.Option>
          <Combobox.Option value="before">aikaisemmin kuin</Combobox.Option>
          <Combobox.Option value="at">tasan</Combobox.Option>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
