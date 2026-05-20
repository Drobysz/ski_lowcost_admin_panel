export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  adminName: string;
}

export interface LoginValues {
  name: string;
  password: string;
}
