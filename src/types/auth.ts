export interface User {
  user_id: number;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthError {
  detail: [
    {
      loc: [string, number];
      msg: string;
      type: string;
    }
  ];
}
