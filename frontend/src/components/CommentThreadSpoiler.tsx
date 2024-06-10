import { Divider, Flex, SpoilerProps, Stack, Text } from "@mantine/core";
import { ExtendedTask } from "../types/Task";
import useExtendedComments from "../hooks/useExtendedComments";
import MarkdownFormattedText from "./MarkdownFormattedText";
import UserWidget from "./UserWidget";
import { DateTime } from "ts-luxon";

interface CommentThreadSpoilerProps extends SpoilerProps {
  task: ExtendedTask;
}

export default function CommentThreadSpoiler({
  task,
}: CommentThreadSpoilerProps) {
  const comments = useExtendedComments(task);

  if (comments?.length && comments.length >= 2)
    return (
      // <Spoiler {...others} maxHeight={0}>
      <Stack gap="xs">
        <Divider />
        {comments.slice(1).map((comment) => (
          <Flex key={comment.ts} justify="flex-start" align="center" gap="xs">
            <Text c="dimmed" size="xs" opacity={0.5}>
              {DateTime.fromSeconds(Number(comment.ts))
                .setLocale("fi-FI")
                .toLocaleString(DateTime.DATETIME_SHORT)}
            </Text>
            <UserWidget user={comment.user} showName />
            <MarkdownFormattedText text={comment.text} />
          </Flex>
        ))}
      </Stack>
      // </Spoiler>
    );
}
