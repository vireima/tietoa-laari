import { Avatar, Group, Stack, Text, Tooltip } from "@mantine/core";
import User from "../types/User";
import { userDisplayName } from "../api/getUsers";
import convertEmoji from "../api/convertEmoji";

export default function UserWidget({
  user,
  showName,
}: {
  user?: User;
  showName?: boolean;
}) {
  if (user)
    return (
      <Group gap="xs">
        <Tooltip
          withArrow
          label={
            <Stack gap="xs">
              <Text>{user.profile.real_name}</Text>
              {user.profile.status_text !== "" && (
                <Group gap="xs">
                  <Text>{convertEmoji(user.profile.status_emoji)}</Text>
                  <Text c="dimmed" fs="italic">
                    "{user.profile.status_text}"
                  </Text>
                </Group>
              )}
            </Stack>
          }
        >
          <Group gap={"xs"}>
            <Avatar src={user.profile.image_512} size="sm" />

            {showName && (
              <Text c={`#${user.color}`} fw={700}>
                {userDisplayName(user)}
              </Text>
            )}
          </Group>
        </Tooltip>
      </Group>
    );
}
