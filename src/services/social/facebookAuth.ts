import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';

export interface FacebookAuthResult {
  token: string;
  email: string;
  name: string;
  photo: string | null;
}

export const signInWithFacebook = async (): Promise<FacebookAuthResult> => {
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw new Error('Facebook login was cancelled');
  }

  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    throw new Error('Failed to obtain Facebook access token');
  }

  const userInfo = await fetchFacebookUserInfo(data.accessToken);

  return {
    token: data.accessToken,
    email: userInfo.email ?? '',
    name: userInfo.name ?? '',
    photo: userInfo.picture?.data?.url ?? null,
  };
};

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
        parameters: {
          fields: { string: 'email,name,picture.type(large)' },
        },
      },
      (error, result) => {
        if (error) {
          reject(new Error('Failed to fetch Facebook user info'));
        } else {
          resolve(result as FacebookUserInfo);
        }
      },
    );
    new GraphRequestManager().addRequest(request).start();
  });
};

export const signOutFacebook = (): void => {
  LoginManager.logOut();
};
