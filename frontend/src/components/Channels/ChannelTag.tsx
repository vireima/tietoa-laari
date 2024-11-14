import { Anchor, Skeleton, TextProps } from "@mantine/core";
import Channel from "../../types/Channel";
import useMappedQueries from "../../hooks/useMappedQueries";

interface ChannelTagProps extends TextProps {
  channel?: Channel | string;
}

export default function ChannelTag({ channel, ...others }: ChannelTagProps) {
  if (!channel) {
    console.error("Empty channel: ", channel);
    return <></>;
  }

  const { channelsMap, channelsStatus } = useMappedQueries();

  const channelData =
    typeof channel === "string" ? channelsMap.get(channel) : channel;

  if (!channelsStatus.isPending && !channelData) {
    console.error("Channel not found:", channel);
    return <></>;
  }

  return (
    <Skeleton visible={channelsStatus.isPending} component="span">
      <Anchor
        href={`slack://channel?team=T1FB2571R&id=${channelData?.id}`}
        {...others}
      >
        #{channelData?.name ?? "placeholderkanava"}
      </Anchor>
    </Skeleton>
  );
}
