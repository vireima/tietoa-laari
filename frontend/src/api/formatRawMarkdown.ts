import Channel from "../types/Channel";
import User from "../types/User";
import { userDisplayName } from "./getUsers";

export function stripRawMarkdown(
  markdown: string,
  usersMap: Map<string, User>,
  channelsMap: Map<string, Channel>
) {
  const userMentions = markdown.replaceAll(
    /<@(\w+)>/g,
    (match, p1) => "@" + userDisplayName(usersMap.get(p1))
  );
  const channelMentions = userMentions.replaceAll(
    /<#(\w+)\|>/g,
    (match, p1) => `#${channelsMap.get(p1)?.name || p1}`
  );

  const bold = channelMentions.replaceAll(
    /\*([^\n*]+)\*/g,
    (match, p1) => `${p1}`
  );

  const italic = bold.replaceAll(/_([^\n_]+)_/g, (match, p1) => `${p1}`);

  const strikethrough = italic.replaceAll(
    /~([^\n~]+)~/g,
    (match, p1) => `${p1}`
  );

  const code = strikethrough.replaceAll(/`([^\n`]+)`/g, (match, p1) => `${p1}`);

  const codeblock = code.replaceAll(/```(.+)```/gs, (match, p1) => `${p1}`);

  const x = codeblock;

  // const newlines = x.replaceAll(/\n(?=((?!<\/pre).)*?(<pre|$))/gs, () => ``);

  return x;
}

export default function formatRawMarkdown(
  markdown: string,
  usersMap: Map<string, User>,
  channelsMap: Map<string, Channel>
) {
  const userMentions = markdown.replaceAll(
    /<@(\w+)>/g,
    (match, p1) => "@" + userDisplayName(usersMap.get(p1))
  );
  const channelMentions = userMentions.replaceAll(
    /<#(\w+)\|>/g,
    (match, p1) =>
      `<a href='https://tietoa.slack.com/archives/${p1}' target='_blank'>#${
        channelsMap.get(p1)?.name || p1
      }</a>`
  );

  const bold = channelMentions.replaceAll(
    /\*([^\n*]+)\*/g,
    (match, p1) => `<b>${p1}</b>`
  );

  const italic = bold.replaceAll(/_([^\n_]+)_/g, (match, p1) => `<i>${p1}</i>`);

  const strikethrough = italic.replaceAll(
    /~([^\n~]+)~/g,
    (match, p1) => `<del>${p1}</del>`
  );

  const code = strikethrough.replaceAll(
    /`([^\n`]+)`/g,
    (match, p1) => `<code>${p1}</code>`
  );

  const codeblock = code.replaceAll(
    /```(.+)```/gs,
    (match, p1) => `<pre><code>${p1}</code></pre>`
  );

  const x = codeblock;

  const newlines = x.replaceAll(
    /\n(?=((?!<\/pre).)*?(<pre|$))/gs,
    () => `<br/>`
  );

  return newlines;
}
