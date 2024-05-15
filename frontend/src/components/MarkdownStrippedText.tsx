import { TextProps, Text } from "@mantine/core";
import { stripRawMarkdown } from "../api/formatRawMarkdown";
import useMappedQueries from "../hooks/useMappedQueries";

interface MarkdownStrippedTextProps extends TextProps {
  text: string;
}

export default function MarkdownStrippedText({
  text,
  ...others
}: MarkdownStrippedTextProps) {
  const { channelsMap, usersMap } = useMappedQueries();

  return (
    <Text {...others}>
      {stripRawMarkdown(text, usersMap, channelsMap).split("\n", 1)[0]}
    </Text>
  );
}
