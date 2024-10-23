import {
  Anchor,
  Avatar,
  Group,
  Skeleton,
  Stack,
  Text,
  TextProps,
} from "@mantine/core";
import User from "../../types/User";
import Tooltip from "../Tooltip";
import useMappedQueries from "../../hooks/useMappedQueries";
import convertEmoji from "../../api/convertEmoji";

interface UserTagProps extends TextProps {
  user?: User | string;
}

export default function UserTag({ user, ...others }: UserTagProps) {
  if (!user) {
    console.error("empty user: ", user);
    return <></>;
  }

  const { usersMap, usersStatus } = useMappedQueries();

  const userData = typeof user === "string" ? usersMap.get(user) : user;

  if (!userData)
    if (usersStatus.isPending) return <Skeleton component="span" width={20} />;
    else {
      console.error("user not found:", user);
      return <></>;
    }

  const tooltip = (
    <Stack gap={"xs"}>
      <Group>
        <Avatar src={userData.profile.image_512} size="sm"></Avatar>
        <Text>{userData.profile.real_name}</Text>
      </Group>
      {userData.profile.status_emoji !== "" ? (
        <Group gap={"xs"}>
          <Text>{convertEmoji(userData.profile.status_emoji)}</Text>
          <Text fs="italic" c="dimmed">
            "{userData.profile.status_text}"
          </Text>
        </Group>
      ) : (
        <></>
      )}
    </Stack>
  );

  return (
    <Tooltip tooltip={tooltip}>
      <Anchor
        href={`slack://user?team=T1FB2571R&id=${userData.id}`}
        {...others}
      >
        @
        {userData.profile.display_name ||
          userData.profile.real_name ||
          userData.name}
      </Anchor>
    </Tooltip>
  );
}
