import { TextProps, Text } from "@mantine/core";
import { stripRawMarkdown } from "../api/formatRawMarkdown";
import useMappedQueries from "../hooks/useMappedQueries";

interface MarkdownStrippedTextProps extends TextProps {
  text: string;
  line?: number;
}

export default function MarkdownStrippedText({
  text,
  line = 0,
  ...others
}: MarkdownStrippedTextProps) {
  const { channelsMap, usersMap } = useMappedQueries();

  return (
    <Text {...others} lineClamp={1}>
      {
        stripRawMarkdown(text, usersMap, channelsMap).split("\n", line + 1)[
          line
        ]
      }
    </Text>
  );
}
