import {
  Avatar,
  Group,
  MultiSelect,
  MultiSelectProps,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { IconAt } from "@tabler/icons-react";
import useMappedQueries from "../../hooks/useMappedQueries";
import convertEmoji from "../../api/convertEmoji";

interface UsersMultiSelectProps extends MultiSelectProps {
  // users: User[] | undefined;
}

export default function UsersMultiSelect({ ...others }: UsersMultiSelectProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    others.value || []
  );
  const { usersMap } = useMappedQueries();

  const renderUserOption: MultiSelectProps["renderOption"] = ({ option }) => (
    <Group gap="xs">
      <Avatar src={usersMap.get(option.value)?.profile.image_32} size="md" />
      <div>
        <Text size="md">
          {usersMap.get(option.value)?.profile.display_name}
        </Text>
        <Group gap="xs">
          <Text size="xs" opacity={0.5}>
            {usersMap.get(option.value)?.profile.real_name}
          </Text>
          <Text size="sm">
            {convertEmoji(
              usersMap.get(option.value)?.profile.status_emoji || ""
            )}
          </Text>
          <Text size="xs" opacity={0.5} fs="italic">
            {usersMap.get(option.value)?.profile.status_text}
          </Text>
        </Group>
      </div>
    </Group>
  );

  return (
    <MultiSelect
      {...others}
      value={selectedUsers}
      leftSection={<IconAt stroke={1.2} size="1.2rem" />}
      onChange={(userIDs: string[]) => {
        setSelectedUsers(userIDs);
        others.onChange && others.onChange(userIDs);
      }}
      data={Array.from(usersMap.values()).map((user) => ({
        label: user.profile.display_name,
        value: user.id,
      }))}
      renderOption={renderUserOption}
      searchable
      clearable
    />
  );
}

// interface UsersSingleSelectProps extends SelectProps {}

// export function UsersSingleSelect({ ...others }: UsersSingleSelectProps) {
//   const [selectedUser, setSelectedUser] = useState<string | undefined>(
//     others.value || undefined
//   );
//   const { usersMap } = useMappedQueries();

//   const renderUserOption: MultiSelectProps["renderOption"] = ({ option }) => (
//     <Group gap="xs">
//       <Avatar src={usersMap.get(option.value)?.profile.image_32} size="md" />
//       <div>
//         <Text size="md">
//           {usersMap.get(option.value)?.profile.display_name}
//         </Text>
//         <Group gap="xs">
//           <Text size="xs" opacity={0.5}>
//             {usersMap.get(option.value)?.profile.real_name}
//           </Text>
//           <Text size="sm">
//             {convertEmoji(
//               usersMap.get(option.value)?.profile.status_emoji || ""
//             )}
//           </Text>
//           <Text size="xs" opacity={0.5} fs="italic">
//             {usersMap.get(option.value)?.profile.status_text}
//           </Text>
//         </Group>
//       </div>
//     </Group>
//   );

//   return (
//     <Select
//       {...others}
//       onChange={(userID: string | null) => {
//         setSelectedUser(userID || undefined);
//         others.onChange && others.onChange(userID || undefined);
//       }}
//       data={Array.from(usersMap.values()).map((user) => ({
//         label: user.profile.display_name,
//         value: user.id,
//       }))}
//       renderOption={renderUserOption}
//       searchable
//       clearable
//     />
//   );
// }
