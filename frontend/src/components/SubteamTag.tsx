import { Text, TextProps } from "@mantine/core";

interface SubteamTagProps extends TextProps {
  subteam: string;
}

export default function SubteamTag({ subteam, ...others }: SubteamTagProps) {
  return (
    <Text span {...others}>
      {subteam}
    </Text>
  );
}
