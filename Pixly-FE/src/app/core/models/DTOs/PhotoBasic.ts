import { User } from "./User";

export interface PhotoBasic {
  photoId?: number;
  title: string;
  url: string;
  slug: string;
  user: User | null;
  state: string | null;
  orientation: string;
  isCurrentUserLiked: boolean;
  isCurrentUserSaved: boolean;
}
