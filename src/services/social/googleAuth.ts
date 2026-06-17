import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { ENV } from '../../config/env';
import { mockSocialLogin } from './mockAuth';

export const configureGoogleSignIn = (): void => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    iosClientId: ENV.GOOGLE_IOS_CLIENT_ID,
    offlineAccess: true,
    scopes: ['profile', 'email'],
  });
};

export interface GoogleAuthResult {
  token: string;
  email: string;
  name: string;
  photo: string | null;
}

const isConfigured = (): boolean =>
  Boolean(ENV.GOOGLE_WEB_CLIENT_ID && !ENV.GOOGLE_WEB_CLIENT_ID.startsWith('your-'));

export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  if (!isConfigured()) {
    const mock = await mockSocialLogin('google');
    return { ...mock, photo: null };
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    return {
      token: tokens.idToken,
      email: userInfo.data?.user.email ?? '',
      name: userInfo.data?.user.name ?? '',
      photo: userInfo.data?.user.photo ?? null,
    };
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Google sign-in was cancelled');
    }
    // SDK not configured / play services issue — fall back to mock in dev
    if (__DEV__) {
      const mock = await mockSocialLogin('google');
      return { ...mock, photo: null };
    }
    throw error;
  }
};

export const signOutGoogle = async (): Promise<void> => {
  if (!isConfigured()) return;
  await GoogleSignin.signOut();
};

export { statusCodes as GoogleStatusCodes };
