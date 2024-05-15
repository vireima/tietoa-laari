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
          <Avatar src={user.profile.image_32} size="sm" />
        </Tooltip>
        {showName && <Text c={`#${user.color}`}>{userDisplayName(user)}</Text>}
      </Group>
    );
}
