import useQueries from "./useQueries";

export default function useMappedQueries() {
  const { usersQuery, channelsQuery } = useQueries();
  const usersMap = new Map(usersQuery.data?.map((user) => [user.id, user]));
  const channelsMap = new Map(channelsQuery.data?.map((ch) => [ch.id, ch]));

  return { usersMap, channelsMap };
}
