import {
  Anchor,
  HighlightProps,
  Text,
  Highlight,
  TextProps,
} from "@mantine/core";
import UserTag from "./Users/UserTag";
import useMappedQueries from "../hooks/useMappedQueries";
import User from "../types/User";
import ChannelTag from "./Channels/ChannelTag";
import React from "react";
import SubteamTag from "./SubteamTag";

function formatMarkdown(markdown: string) {
  const bold = markdown.replaceAll(
    /\*([^\n*]+)\*/g,
    (match, p1) => `<b>${p1}</b>`
  );

  const italic = bold.replaceAll(/_([^\n_]+)_/g, (match, p1) => `<i>${p1}</i>`);

  const strikethrough = italic.replaceAll(
    /~([^\n~]+)~/g,
    (match, p1) => `<del>${p1}</del>`
  );
  const codeblock = strikethrough.replaceAll(
    /```(.+)```/gs,
    (match, p1) => `<pre><code>${p1}</code></pre>`
  );

  const code = codeblock.replaceAll(
    /`([^\n`]+)`/g,
    (match, p1) => `<code>${p1}</code>`
  );

  const newlines = code.replaceAll(
    /\n(?=((?!<\/pre).)*?(<pre|$))/gs,
    () => `<br/>`
  );

  return newlines;
}

function parseSlackFormatting(
  text: string,
  usersMap: Map<string, User>
): JSX.Element[] {
  const matches = text.matchAll(/<(.*?)>/g);
  let arr = [];
  let start = 0;

  for (const match of matches) {
    arr.push(
      <span
        dangerouslySetInnerHTML={{
          __html: formatMarkdown(text.slice(start, match.index)),
        }}
      />
    );

    if (match[1].startsWith("#C")) {
      const m = match[1].match(/^#([^|]+)\|?$/);
      if (m !== null) arr.push(<ChannelTag channel={m[1]} />);
    } else if (match[1].startsWith("@"))
      arr.push(<UserTag user={match[1].slice(1)} />);
    else if (match[1].startsWith("!subteam")) {
      const m = match[1].match(/\^(.+)$/);
      if (m !== null) arr.push(<SubteamTag subteam={m[1]} />);
    } else if (match[1].startsWith("!"))
      arr.push(
        <Text span fw={600}>
          @{match[1].slice(1)}
        </Text>
      );
    else {
      const m = match[1].match(/^([^|]+?)\|(.+?)$/);
      if (!m) arr.push(<Anchor href={match[1]}>{match[1]}</Anchor>);
      else arr.push(<Anchor href={m[1]}>{m[2]}</Anchor>);
    }

    start = match.index + match[0].length;
  }

  arr.push(
    <span
      dangerouslySetInnerHTML={{
        __html: formatMarkdown(text.slice(start)),
      }}
    />
  );

  return arr;
}

interface FormattedTextProps extends TextProps {
  text: string;
}

export default function FormattedText({ text, ...others }: FormattedTextProps) {
  const { usersMap } = useMappedQueries();
  // console.log(parse(text, parsers, 0));

  // const arr = [];

  // const matches = text.matchAll(bold);
  // let start = 0;

  // for (const match of matches) {
  //   arr.push(text.slice(start, match.index), `!!${match[1]}!!`);

  //   start += match.index + match[0].length;
  // }

  // console.log(arr.join("|"));
  return (
    <Text {...others}>
      {parseSlackFormatting(text, usersMap).map((elem, index) =>
        React.cloneElement(elem, { key: index })
      )}
    </Text>
  );
}
