import { Platform } from 'react-native';
import appleAuth, {
  AppleRequestOperation,
  AppleRequestScope,
  AppleCredentialState,
} from '@invertase/react-native-apple-authentication';
import { mockSocialLogin } from './mockAuth';

export interface AppleAuthResult {
  token: string;
  email: string | null;
  name: string | null;
}

export const isAppleAuthAvailable = (): boolean =>
  Platform.OS === 'ios' && appleAuth.isSupported;

export const signInWithApple = async (): Promise<AppleAuthResult> => {
  if (!isAppleAuthAvailable()) {
    const mock = await mockSocialLogin('apple');
    return { token: mock.token, email: mock.email, name: mock.name };
  }

  try {
    const response = await appleAuth.performRequest({
      requestedOperation: AppleRequestOperation.LOGIN,
      requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
    });

    const { identityToken, email, fullName } = response;
    if (!identityToken) throw new Error('Apple Sign-In failed: No identity token received');

    const credentialState = await appleAuth.getCredentialStateForUser(response.user);
    if (credentialState !== AppleCredentialState.AUTHORIZED) {
      throw new Error('Apple credential is not authorized');
    }

    const name =
      fullName?.givenName && fullName?.familyName
        ? `${fullName.givenName} ${fullName.familyName}`
        : fullName?.givenName ?? null;

    return { token: identityToken, email, name };
  } catch (error: unknown) {
    const msg = (error as Error)?.message ?? '';
    if (msg.includes('cancelled') || msg.includes('cancel')) throw error;
    if (__DEV__) {
      const mock = await mockSocialLogin('apple');
      return { token: mock.token, email: mock.email, name: mock.name };
    }
    throw error;
  }
};

export { AppleCredentialState };
