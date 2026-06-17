import axiosInstance from './axiosInstance';
import { Endpoints } from './endpoints';
import { AuthResponse, LoginRequest, SocialLoginRequest, User } from '../../types';

// Normalizes login response regardless of envelope shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeAuthResponse = (data: any): AuthResponse => {
  const payload = data?.data ?? data;
  const token: string =
    payload?.token ?? payload?.access_token ?? payload?.accessToken ?? '';
  const refreshToken: string =
    payload?.refresh_token ?? payload?.refreshToken ?? '';
  const rawUser = payload?.user ?? payload;

  const user: User = {
    id: String(rawUser?.id ?? rawUser?._id ?? ''),
    name: rawUser?.name ?? rawUser?.full_name ?? rawUser?.username ?? '',
    email: rawUser?.email ?? '',
    avatar: rawUser?.avatar ?? rawUser?.profile_image ?? rawUser?.image,
  };

  return { accessToken: token, refreshToken, user };
};

export const loginWithEmail = async (body: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(Endpoints.login, body);
  return normalizeAuthResponse(response.data);
};

export const loginWithSocial = async (body: SocialLoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(Endpoints.socialLogin, body);
  return normalizeAuthResponse(response.data);
};
