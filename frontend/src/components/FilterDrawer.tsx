import { useSearchParams } from "react-router-dom";
// import useQueries from "../hooks/useQueries";
import {
  Divider,
  Drawer,
  DrawerProps,
  Group,
  Kbd,
  Stack,
  Text,
  Title,
} from "@mantine/core";
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
        <Divider />
        <Title order={6}>Pikanäppäimiä</Title>
        <Group>
          <Text size="xs" c="dimmed">
            <Kbd>1</Kbd> / <Kbd>2</Kbd> / <Kbd>3</Kbd> / <Kbd>3</Kbd>
          </Text>
          <Text size="xs" c="dimmed">
            Laari / Jono / Maali / Arkisto
          </Text>
        </Group>
        <Group>
          <Text size="xs" c="dimmed">
            <Kbd>F</Kbd>
          </Text>
          <Text size="xs" c="dimmed">
            Avaa tämä valikko
          </Text>
        </Group>
        <Group>
          <Text size="xs" c="dimmed">
            <Kbd>Ctrl</Kbd>+<Kbd>E</Kbd>
          </Text>
          <Text size="xs" c="dimmed">
            Muokkaa ehdotusta
          </Text>
        </Group>
        <Group>
          <Text size="xs" c="dimmed">
            <Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd>
          </Text>
          <Text size="xs" c="dimmed">
            Tallenna muokkaus
          </Text>
        </Group>
        <Group>
          <Text size="xs" c="dimmed">
            <Kbd>Esc</Kbd>
          </Text>
          <Text size="xs" c="dimmed">
            Sulje avoin valikko
          </Text>
        </Group>
        <Group>
          <Text size="xs" c="dimmed">
            <Kbd>Ctrl</Kbd>+<Kbd>T</Kbd>
          </Text>
          <Text size="xs" c="dimmed">
            Vaihda päivä/yö -teemaa
          </Text>
        </Group>
      </Stack>
    </Drawer>
  );
}
