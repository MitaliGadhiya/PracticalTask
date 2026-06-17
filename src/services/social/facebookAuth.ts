import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { ENV } from '../../config/env';
import { mockSocialLogin } from './mockAuth';

export interface FacebookAuthResult {
  token: string;
  email: string;
  name: string;
  photo: string | null;
}

const isConfigured = (): boolean =>
  Boolean(ENV.FACEBOOK_APP_ID && !ENV.FACEBOOK_APP_ID.startsWith('your-'));

interface FacebookUserInfo {
  email?: string;
  name?: string;
  picture?: { data?: { url?: string } };
}

const fetchFacebookUserInfo = (accessToken: string): Promise<FacebookUserInfo> => {
  return new Promise((resolve, reject) => {
    const request = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: { fields: { string: 'email,name,picture.type(large)' } },
      },
      (error, result) => {
        if (error) reject(new Error('Failed to fetch Facebook user info'));
        else resolve(result as FacebookUserInfo);
      },
    );
    new GraphRequestManager().addRequest(request).start();
  });
};

export const signInWithFacebook = async (): Promise<FacebookAuthResult> => {
  if (!isConfigured()) {
    const mock = await mockSocialLogin('facebook');
    return { ...mock, photo: null };
  }

  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) throw new Error('Facebook login was cancelled');

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) throw new Error('Failed to obtain Facebook access token');

    const userInfo = await fetchFacebookUserInfo(data.accessToken);
    return {
      token: data.accessToken,
      email: userInfo.email ?? '',
      name: userInfo.name ?? '',
      photo: userInfo.picture?.data?.url ?? null,
    };
  } catch (error: unknown) {
    const msg = (error as Error)?.message ?? '';
    if (msg.includes('cancelled')) throw error;
    if (__DEV__) {
      const mock = await mockSocialLogin('facebook');
      return { ...mock, photo: null };
    }
    throw error;
  }
};

export const signOutFacebook = (): void => {
  if (!isConfigured()) return;
  LoginManager.logOut();
};
