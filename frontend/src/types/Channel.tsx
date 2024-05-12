export default interface Channel {
  id: string;
  name: string | undefined;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_private: boolean;
  user: string | undefined;
}
