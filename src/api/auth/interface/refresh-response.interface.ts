import { LoginResponse } from './login-response.interface';

export interface RefreshResponse extends Partial<LoginResponse> {
  newRefreshToken: string;
}
