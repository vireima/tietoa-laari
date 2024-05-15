import { TypographyStylesProvider } from "@mantine/core";
import formatRawMarkdown from "../api/formatRawMarkdown";
import useMappedQueries from "../hooks/useMappedQueries";

export default function MarkdownFormattedText({ text }: { text: string }) {
  const { channelsMap, usersMap } = useMappedQueries();

  return (
    <TypographyStylesProvider>
      <div
        dangerouslySetInnerHTML={{
          __html: formatRawMarkdown(text, usersMap, channelsMap),
        }}
      />
    </TypographyStylesProvider>
  );
}
