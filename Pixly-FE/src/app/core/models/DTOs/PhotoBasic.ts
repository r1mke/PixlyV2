import { User } from "./User";

export interface PhotoBasic {
  photoId: number;
  title: string;
  url: string;
  slug: string;
  user: User;
  state: string;
  orientation: string;
  isCurrentUserLiked: boolean;
  isCurrentUserSaved: boolean;
  uploadedAt: string;
}
