import { Divider, Flex, Spoiler, SpoilerProps, Stack } from "@mantine/core";
import { ExtendedTask } from "../types/Task";
import useExtendedComments from "../hooks/useExtendedComments";
import MarkdownFormattedText from "./MarkdownFormattedText";
import UserWidget from "./UserWidget";

interface CommentThreadSpoilerProps extends SpoilerProps {
  task: ExtendedTask;
}

export default function CommentThreadSpoiler({
  task,
  ...others
}: CommentThreadSpoilerProps) {
  const comments = useExtendedComments(task);

  if (comments?.length && comments.length >= 2)
    return (
      // <Spoiler {...others} maxHeight={0}>
      <Stack gap="xs">
        {comments.slice(1).map((comment) => (
          <Flex
            key={comment.ts}
            justify="flex-start"
            align="flex-start"
            gap="xs"
          >
            <UserWidget user={comment.user} showName />
            <MarkdownFormattedText text={comment.text} />
          </Flex>
        ))}
      </Stack>
      // </Spoiler>
    );
}
