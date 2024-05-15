import { useSearchParams } from "react-router-dom";
// import useQueries from "../hooks/useQueries";
import { Drawer, DrawerProps } from "@mantine/core";
import ChannelSelect from "./ChannelSelect";

export default function FilterDrawer(props: DrawerProps) {
  //   const { usersQuery, channelsQuery } = useQueries();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Drawer {...props} size="xs">
      <ChannelSelect
        value={searchParams.get("channel")}
        onChange={(value) => {
          if (value) searchParams.set("channel", value);
          else searchParams.delete("channel");
          setSearchParams(searchParams);
        }}
      />
    </Drawer>
  );
}
