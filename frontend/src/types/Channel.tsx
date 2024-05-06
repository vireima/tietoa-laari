export default interface Channel {
  id: string;
  name: string | null;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_private: boolean;
  user: string | null;
}
