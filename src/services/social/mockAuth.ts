import { Alert } from 'react-native';

export const mockSocialLogin = (provider: 'google' | 'facebook' | 'apple'): Promise<never> => {
  const name = provider.charAt(0).toUpperCase() + provider.slice(1);
  return new Promise((_, reject) => {
    Alert.alert(
      `${name} Login`,
      `${name} login requires API keys to be configured in the .env file.`,
      [{ text: 'OK', onPress: () => reject(new Error('Not configured')) }],
    );
  });
};
