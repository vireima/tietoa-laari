import EmojiConvertor from "emoji-js";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

export default function convertEmoji(str: string) {
  return emoji.replace_colons(str);
}
