import { Outlet } from "react-router-dom";
import DrawerSettings from "../components/DrawerSettings";
import { Task } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/Header";

export interface TaskDataOutletContext {
  tasks: Task[] | null;
  users: User[] | null;
  channels: Channel[] | null;
}

export default function Layout() {
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <>
      <DrawerSettings opened={opened} onClose={close} />
      <Header drawerOpened={opened} drawerToggle={toggle} />
      <Outlet />
    </>
  );
}
