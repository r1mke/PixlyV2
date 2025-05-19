export interface RegisterResponse {
  userId: string;
  email: string;
  requiresEmailConfirmation: boolean;
  token: string;
  expiration: string;
}
