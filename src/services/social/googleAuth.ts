import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
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
  Boolean(
    ENV.GOOGLE_WEB_CLIENT_ID &&
    !ENV.GOOGLE_WEB_CLIENT_ID.startsWith('your-') &&
    !ENV.GOOGLE_WEB_CLIENT_ID.startsWith('000000'),
  );

export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  if (!isConfigured()) {
    await mockSocialLogin('google');
    return { token: '', email: '', name: '', photo: null }; // never reached — mockSocialLogin rejects
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const userInfo = await GoogleSignin.signIn();

  if (userInfo.type !== 'success') {
    throw new Error('Google sign-in cancelled');
  }

  const tokens = await GoogleSignin.getTokens();

  return {
    token: tokens.idToken,
    email: userInfo.data.user.email,
    name: userInfo.data.user.name ?? '',
    photo: userInfo.data.user.photo ?? null,
  };
};

export const signOutGoogle = async (): Promise<void> => {
  if (!isConfigured()) return;
  await GoogleSignin.signOut();
};

export { statusCodes as GoogleStatusCodes };
