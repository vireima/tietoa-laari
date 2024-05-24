import { useSearchParams } from "react-router-dom";
// import useQueries from "../hooks/useQueries";
import { Divider, Drawer, DrawerProps, Stack } from "@mantine/core";
import ChannelSelect from "./ChannelSelect";
import SortOptionsMultiSelect from "./SortOptionsMultiSelect";

export default function FilterDrawer(props: DrawerProps) {
  //   const { usersQuery, channelsQuery } = useQueries();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Drawer {...props} size="xs" title="Filtterit">
      <Stack>
        <ChannelSelect
          label="Slack-kanava"
          description="Vain valitun kanavan ehdotukset"
          value={searchParams.get("channel")}
          onChange={(value) => {
            if (value) searchParams.set("channel", value);
            else searchParams.delete("channel");
            setSearchParams(searchParams);
          }}
          variant="default"
        />
        <Divider />
        <SortOptionsMultiSelect
          label="Järjestys"
          description="Järjestää ehdotukset valittujen arvojen mukaan"
          value={searchParams.getAll("sort")}
          onChange={(values) => {
            searchParams.delete("sort");
            if (values && values.length) {
              values.forEach((value) => searchParams.append("sort", value));
            }

            setSearchParams(searchParams);
          }}
        />
      </Stack>
    </Drawer>
  );
}
