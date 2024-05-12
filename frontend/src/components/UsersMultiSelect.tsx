import {
  Avatar,
  Group,
  MultiSelect,
  MultiSelectProps,
  Text,
} from "@mantine/core";
import User from "../types/User";
import { useState } from "react";
import EmojiConvertor from "emoji-js";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

export default function UsersMultiSelect({
  users,
  onChange,
  value,
  label,
  description,
}: {
  users: User[] | undefined;
  onChange: (userIDs: string[]) => void;
  value: string[] | undefined;
  label: string;
  description: string;
}) {
  const userMap = new Map(users?.map((user) => [user.id, user]));
  const [selectedUsers, setSelectedUsers] = useState<string[] | undefined>(
    value
  );

  const renderUserOption: MultiSelectProps["renderOption"] = ({ option }) => (
    <Group gap="xs">
      <Avatar src={userMap.get(option.value)?.profile.image_32} size="md" />
      <div>
        <Text size="md">{userMap.get(option.value)?.profile.display_name}</Text>
        <Group gap="xs">
          <Text size="xs" opacity={0.5}>
            {userMap.get(option.value)?.profile.real_name}
          </Text>
          <Text size="sm">
            {emoji.replace_colons(
              userMap.get(option.value)?.profile.status_emoji || ""
            )}
          </Text>
          <Text size="xs" opacity={0.5} fs="italic">
            {userMap.get(option.value)?.profile.status_text}
          </Text>
        </Group>
      </div>
    </Group>
  );

  return (
    <MultiSelect
      label={label}
      description={description}
      value={selectedUsers}
      onChange={(userIDs: string[]) => {
        setSelectedUsers(userIDs);
        onChange(userIDs);
      }}
      data={users?.map((user) => ({
        label: user.profile.display_name,
        value: user.id,
      }))}
      renderOption={renderUserOption}
      searchable
      clearable
    />
  );
}
