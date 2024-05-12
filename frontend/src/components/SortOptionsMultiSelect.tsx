import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { IconSortDescending } from "@tabler/icons-react";

interface SortOptionsMultiSelectProps extends MultiSelectProps {}

export default function SortOptionsMultiSelect({
  ...others
}: SortOptionsMultiSelectProps) {
  const sortOptionValues = [
    "created",
    "modified",
    "channel",
    "author",
    "assignee",
    "priority",
    "votes",
  ];
  const sortOptionLabels = [
    "Luotu",
    "Muutettu",
    "Kanava",
    "Ehdottaja",
    "Vastuullinen",
    "Prioriteetti",
    "Ääniä",
  ];

  return (
    <MultiSelect
      {...others}
      data={sortOptionValues.map((s, i) => ({
        value: s,
        label: sortOptionLabels[i],
      }))}
      leftSection={<IconSortDescending stroke={1.2} size="1.2rem" />}
      //   data={sortOptionValues}
      clearable
    />
  );
}
