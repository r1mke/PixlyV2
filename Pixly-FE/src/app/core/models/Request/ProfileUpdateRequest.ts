export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: File;
}
