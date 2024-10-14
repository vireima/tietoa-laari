import { Box, HoverCard, HoverCardProps, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PropsWithChildren } from "react";

interface TooltipProps extends HoverCardProps {
  tooltip: React.ReactNode;
}

export default function Tooltip({
  tooltip,
  children,
  ...others
}: TooltipProps) {
  return (
    <HoverCard withArrow arrowSize={12} {...others}>
      <HoverCard.Target>
        <Box>{children}</Box>
      </HoverCard.Target>
      <HoverCard.Dropdown>{tooltip}</HoverCard.Dropdown>
    </HoverCard>
  );
}
