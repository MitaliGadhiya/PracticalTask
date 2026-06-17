import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { ENV } from '../../config/env';

export { GoogleSigninButton };

export const configureGoogleSignIn = (): void => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    androidClientId: ENV.GOOGLE_ANDROID_CLIENT_ID,
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

export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const userInfo = await GoogleSignin.signIn();
  const tokens = await GoogleSignin.getTokens();

  return {
    token: tokens.idToken,
    email: userInfo.data?.user.email ?? '',
    name: userInfo.data?.user.name ?? '',
    photo: userInfo.data?.user.photo ?? null,
  };
};

export const signOutGoogle = async (): Promise<void> => {
  await GoogleSignin.signOut();
};

export const revokeGoogleAccess = async (): Promise<void> => {
  await GoogleSignin.revokeAccess();
};

export { statusCodes as GoogleStatusCodes };
