import { Platform } from 'react-native';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

export interface AppleAuthResult {
  token: string;
  email: string | null;
  name: string | null;
}

export const isAppleAuthAvailable = (): boolean => {
  return Platform.OS === 'ios' && appleAuth.isSupported;
};

export const signInWithApple = async (): Promise<AppleAuthResult> => {
  if (!isAppleAuthAvailable()) {
    throw new Error('Apple Sign-In is not available on this device');
  }

  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: AppleAuthRequestOperation.LOGIN,
    requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
  });

  const { identityToken, email, fullName } = appleAuthRequestResponse;

  if (!identityToken) {
    throw new Error('Apple Sign-In failed: No identity token received');
  }

  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user,
  );

  if (credentialState !== AppleAuthCredentialState.AUTHORIZED) {
    throw new Error('Apple credential is not authorized');
  }

  const name =
    fullName?.givenName && fullName?.familyName
      ? `${fullName.givenName} ${fullName.familyName}`
      : fullName?.givenName ?? null;

  return {
    token: identityToken,
    email,
    name,
  };
};

export { AppleAuthCredentialState };
