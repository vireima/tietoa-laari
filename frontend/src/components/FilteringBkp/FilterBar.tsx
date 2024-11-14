import { Group, Text } from "@mantine/core";
import { ExtendedTask } from "../../types/Task";
import { Filter } from "./Filter";
import { FilterInput } from "./FilterInput";
import { FilterStructure } from "./FilterStructure";

interface FilterBarProps {
  tasks: ExtendedTask[];
  filter: Filter<ExtendedTask>;
  setFilter: (f: Filter<ExtendedTask>) => void;
}

const structure: FilterStructure<ExtendedTask> = [
  {
    field: "description",
    label: "Kuvaus",
    type: "string",
  },
  {
    field: "created",
    label: "Kirjattu",
    type: "datetime",
  },
  {
    field: "modified",
    label: "Muokattu",
    type: "datetime",
  },
  {
    field: "teams",
    label: "Tiimi",
    type: "array",
  },
  {
    field: "author.profile.display_name",
    label: "Ehdottaja",
    type: "string",
  },
  {
    field: "status.label",
    label: "Status",
    type: "string",
  },
  {
    field: "channel.name",
    label: "Kanava",
    type: "string",
  },
];

export function FilterBar({ tasks, filter, setFilter }: FilterBarProps) {
  return (
    <Group grow>
      <FilterInput filter={filter} onChange={setFilter} structure={structure} />
      <Text>{tasks.length}</Text>
    </Group>
  );
}
