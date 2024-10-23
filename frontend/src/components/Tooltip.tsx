import { HoverCard, HoverCardProps } from "@mantine/core";

interface TooltipProps extends HoverCardProps {
  tooltip: React.ReactNode;
}

export default function Tooltip({
  tooltip,
  children,
  ...others
}: TooltipProps) {
  return (
    <HoverCard withArrow arrowSize={12} {...others} closeDelay={20}>
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown>{tooltip}</HoverCard.Dropdown>
    </HoverCard>
  );
}
