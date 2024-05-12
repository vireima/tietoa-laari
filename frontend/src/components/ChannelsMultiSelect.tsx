import { MultiSelect } from "@mantine/core";
import Channel from "../types/Channel";
import { useState } from "react";

export default function ChannelsMultiSelect({
  channels,
  onChange,
  value,
  label,
  description,
}: {
  channels: Channel[] | undefined;
  onChange: (channelIDs: string[]) => void;
  value: string[] | undefined;
  label: string;
  description: string;
}) {
  const [selectedChannels, setSelectedChannels] = useState<
    string[] | undefined
  >(value);
  return (
    <MultiSelect
      label={label}
      description={description}
      value={selectedChannels}
      onChange={(channelIDs: string[]) => {
        setSelectedChannels(channelIDs);
        onChange(channelIDs);
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
