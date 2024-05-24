import { Group, Select, SelectProps } from "@mantine/core";
import { IconHash, IconLock } from "@tabler/icons-react";
import useQueries from "../hooks/useQueries";

const iconProps = {
  stroke: 1.5,
  color: "currentColor",
  opacity: 0.6,
  size: 18,
};

export default function ChannelSelect(props: SelectProps) {
  const { channelsQuery } = useQueries();

  const channelSelectRenderOption: SelectProps["renderOption"] = ({
    option,
  }) => (
    <Group>
      {channelsQuery.data?.find((channel) => channel.id === option.value)
        ?.is_private ? (
        <IconLock {...iconProps} />
      ) : (
        <IconHash {...iconProps} />
      )}
      {option.label}
    </Group>
  );

  return (
    <Select
      variant="transparent"
      {...props}
      leftSection={<IconHash stroke={1.2} size="1.2rem" />}
      data={channelsQuery.data?.map((channel) => ({
        label: channel.name || channel.id,
        value: channel.id,
        channel: channel,
      }))}
      searchable
      clearable
      renderOption={channelSelectRenderOption}
    />
  );
}
