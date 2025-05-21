export interface AuthResponse {
  userId: string;
  email: string;
  requiresEmailConfirmation: boolean;
  token: string;
  expiration: string;
}
