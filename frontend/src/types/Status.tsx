import {
  IconCheck,
  IconCircleHalf2,
  IconCircleOff,
  IconSeeding,
} from "@tabler/icons-react";

export type Status = "todo" | "in progress" | "done" | "closed";

export interface ExtendedStatus {
  status: Status;
  label: string;
  description: string;
  iconElement: typeof IconCheck;
  bgcolor: string;
  color: string;
  number: number;
}

export const statuses = [
  {
    status: "todo" as Status,
    label: "Ehdotus",
    description: "Ehdotettu, ei aloitettu",
    iconElement: IconSeeding,
    bgcolor: "blue.1",
    color: "blue.6",
    number: 0,
  },
  {
    status: "in progress" as Status,
    label: "Käynnissä",
    description: "Aloitettu, työstössä",
    iconElement: IconCircleHalf2,
    // icon: <IconCircleHalf2 color="yellow" />,
    bgcolor: "cyan.2",
    color: "cyan.6",
    number: 10,
  },
  {
    status: "done" as Status,
    label: "Valmis",
    description: "Valmis",
    icon: <IconCheck color="var(--mantine-color-teal-5)" />,
    iconElement: IconCheck,
    bgcolor: "teal.2",
    color: "teal.7",
    number: 20,
  },
  {
    status: "closed" as Status,
    label: "Suljettu",
    description: "Suljettu",
    icon: <IconCircleOff color="var(--mantine-color-gray-5)" />,
    iconElement: IconCircleOff,
    bgcolor: "gray.2",
    color: "gray.6",
    number: 30,
  },
] as ExtendedStatus[];
