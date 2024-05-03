export default interface User {
  id: string;
  color: string;
  deleted: boolean;
  name: string;
  updated: number;
  profile: {
    real_name: string;
    display_name: string;
    status_text: string;
    status_emoji: string;
    image_32: string;
    image_512: string;
  };
  is_bot: boolean;
}
