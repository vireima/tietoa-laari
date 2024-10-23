import {
  Container,
  Group,
  Loader,
  Menu,
  Select,
  SelectProps,
  UnstyledButton,
} from "@mantine/core";
import { Icon123 } from "@tabler/icons-react";
import { ExtendedStatus, statuses } from "../types/Status";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { patchPartialTasks } from "../api/patchTasks";
import { ExtendedTask } from "../types/Task";
import Tooltip from "./Tooltip";
import useAuth from "../hooks/useAuth";

interface StatusDropdownProps {
  task: ExtendedTask;
}

export default function StatusDropdown({ task }: StatusDropdownProps) {
  const [auth, setAuth] = useAuth();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (tasks: Partial<ExtendedTask>[]) =>
      patchPartialTasks(tasks, auth),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  let Icon = task.status.iconElement;
  if (
    mutation.isPending &&
    mutation.variables &&
    mutation.variables[0].status
  ) {
    Icon = mutation.variables[0].status.iconElement;
  }

  return (
    <Tooltip tooltip={task.status.label} position="top">
      <Container fluid={true}>
        <Menu>
          <Menu.Target>
            <Icon size="1rem" stroke={2} />
          </Menu.Target>
          <Menu.Dropdown>
            {statuses.map((status) => {
              return (
                <Menu.Item
                  key={status.number}
                  leftSection={<status.iconElement size="1rem" stroke={2} />}
                  onClick={() =>
                    status.number !== task.status.number
                      ? mutation.mutate([
                          {
                            _id: task._id,
                            status: status,
                          },
                        ])
                      : null
                  }
                >
                  {status.label}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      </Container>
    </Tooltip>
  );
}
