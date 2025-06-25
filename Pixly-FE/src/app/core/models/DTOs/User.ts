export interface User {
  id: string;
  email: string;
  firstName: string;
  userName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  roles: string[];
  isTwoFactorEnabled: boolean;
  emailConfirmed: boolean;
  state: string | null;
  isDeleted: boolean | null;
  profilePictureUrl: string;
}
