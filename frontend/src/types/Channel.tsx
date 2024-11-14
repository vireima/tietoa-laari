export default interface Channel {
  id: string;
  name: string | undefined;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_mpim: boolean;
  is_archived: boolean;
  is_private: boolean;
  user: string | undefined;
  num_members: number;
  topic: { value: string; creator: string; last_set: number };
  purpose: { value: string; creator: string; last_set: number };
}
