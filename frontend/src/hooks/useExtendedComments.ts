import { ExtendedComment } from "../types/Comment";
import { ExtendedTask } from "../types/Task";
import useComments from "./useComments";
import useMappedQueries from "./useMappedQueries";

export default function useExtendedComments(task: ExtendedTask) {
  const comments = useComments(task);
  const { usersMap } = useMappedQueries();

  return comments.data?.map(
    (comment) =>
      <ExtendedComment>{
        ...comment,
        user: usersMap.get(comment.user),
      }
  );
}
