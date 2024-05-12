import { MultiSelect, MultiSelectProps } from "@mantine/core";
import Channel from "../types/Channel";
import { useState } from "react";
import { IconHash } from "@tabler/icons-react";

interface ChannelsMultiSelectProps extends MultiSelectProps {
  channels: Channel[] | undefined;
}

export default function ChannelsMultiSelect({
  channels,
  ...others
}: ChannelsMultiSelectProps) {
  const [selectedChannels, setSelectedChannels] = useState<
    string[] | undefined
  >(others.value);
  return (
    <MultiSelect
      {...others}
      value={selectedChannels}
      leftSection={<IconHash stroke={1.2} size="1.2rem" />}
      onChange={(channelIDs: string[]) => {
        setSelectedChannels(channelIDs);
        others.onChange && others.onChange(channelIDs);
      }}
      data={channels?.map((channel) => ({
        label: channel.name || channel.id,
        value: channel.id,
      }))}
      //   renderOption={renderUserOption}
      searchable
      clearable
    />
  );
}
