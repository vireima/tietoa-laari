import { Box, Center, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { ExtendedTask } from "../types/Task";
import UsersMultiSelect from "./Users/UsersMultiSelect";
import { forwardRef } from "react";

interface TasklistItemProps extends React.ComponentPropsWithoutRef<"button"> {
  task: ExtendedTask;
  selected: boolean;
}

const TasklistItem = forwardRef<HTMLButtonElement, TasklistItemProps>(
  ({ task, selected, ...others }: TasklistItemProps, ref) => (
    <UnstyledButton ref={ref} {...others}>
      <Center>
        <Stack>
          <Text>
            {task.author?.profile.display_name}: {task.description}
          </Text>
          {selected ? (
            <Group>
              <UsersMultiSelect />
              <UsersMultiSelect />
            </Group>
          ) : (
            ""
          )}
        </Stack>
      </Center>
    </UnstyledButton>
  )
);

export default TasklistItem;

// export default function TasklistItem({
//   task,
//   selected,
//   ...others
// }: TasklistItemProps) {
//   return (
//     <Center>
//       <Stack>
//         <Text>
//           {task.author?.profile.display_name}: {task.description}
//         </Text>
//         {selected ? (
//           <Group>
//             <UsersMultiSelect />
//             <UsersMultiSelect />
//           </Group>
//         ) : (
//           ""
//         )}
//       </Stack>
//     </Center>
//   );
// }
