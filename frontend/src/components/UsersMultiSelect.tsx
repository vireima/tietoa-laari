import {
  Avatar,
  Group,
  MultiSelect,
  MultiSelectProps,
  Select,
  Text,
} from "@mantine/core";
import User from "../types/User";
import { useState } from "react";
import EmojiConvertor from "emoji-js";
import { IconAt } from "@tabler/icons-react";

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
      leftSection={<IconAt stroke={1.2} size="1.2rem" />}
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

export function UsersSingleSelect({
  users,
  onChange,
  value,
  label,
  description,
}: {
  users: User[] | undefined;
  onChange: (userID: string | undefined) => void;
  value: string | null;
  label: string;
  description: string;
}) {
  const userMap = new Map(users?.map((user) => [user.id, user]));
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    value || undefined
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
    <Select
      label={label}
      description={description}
      value={selectedUser}
      onChange={(userID: string | null) => {
        setSelectedUser(userID || undefined);
        onChange(userID || undefined);
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
