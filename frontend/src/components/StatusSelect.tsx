import {
  BoxProps,
  ElementProps,
  Stepper,
  StepperFactory,
  StylesApiProps,
} from "@mantine/core";
import { Status, statuses } from "../types/Status";
import { useState } from "react";

interface StatusSelectProps
  extends BoxProps,
    StylesApiProps<StepperFactory>,
    ElementProps<"div"> {
  status: Status;
  onStatusChange: (status: Status) => void;
}

export default function StatusSelect({
  status,
  onStatusChange,
  ...others
}: StatusSelectProps) {
  const [active, setActive] = useState(
    statuses.findIndex((val) => {
      return val.status == status.toString();
    }) + 1
  );
  return (
    <Stepper
      active={active}
      onStepClick={(index) => {
        setActive(index + 1);
        onStatusChange && onStatusChange(statuses[index].status);
      }}
      {...others}
    >
      {statuses.slice(0, -1).map((st, index) => (
        <Stepper.Step
          label={st.label}
          description={st.description}
          key={index}
          icon={<st.iconElement />}
          completedIcon={<st.iconElement />}
          progressIcon={<st.iconElement />}
          color={st.color}
        />
      ))}
    </Stepper>
  );
}
