import { Outlet } from "react-router-dom";
import { InputTask } from "../types/Task";
import User from "../types/User";
import Channel from "../types/Channel";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/Header";
import FilterDrawer from "../components/FilterDrawer";

export interface TaskDataOutletContext {
  tasks: InputTask[] | null;
  users: User[] | null;
  channels: Channel[] | null;
}

export default function SectionLayout() {
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <>
      {/* <DrawerSettings opened={opened} onClose={close} /> */}
      <FilterDrawer opened={opened} onClose={close} />
      <Header drawerOpened={opened} drawerToggle={toggle} />
      <Outlet />
    </>
  );
}
