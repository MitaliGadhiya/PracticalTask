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
    await mockSocialLogin('apple');
    return { token: '', email: null, name: null }; // never reached — mockSocialLogin rejects
  }

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
};

export { AppleCredentialState };
