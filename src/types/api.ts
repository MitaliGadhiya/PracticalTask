export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SocialLoginRequest {
  token: string;
  provider: 'google' | 'facebook' | 'apple';
  email?: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
