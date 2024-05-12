import { Stepper } from "@mantine/core";
import { Status, statuses } from "../types/Status";
import { useState } from "react";

export default function StatusSelect({
  status,
  onChange,
}: {
  status: Status;
  onChange?: (status: Status) => void;
}) {
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
        onChange && onChange(statuses[index].status);
      }}
    >
      {statuses.map((st, index) => (
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
