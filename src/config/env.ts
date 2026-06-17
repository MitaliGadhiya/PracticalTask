import Config from 'react-native-config';

const getEnvVar = (key: string, fallback = ''): string => {
  const value = (Config as Record<string, string | undefined>)[key];
  if (!value && __DEV__) {
    console.warn(`[Env] Missing environment variable: ${key}`);
  }
  return value ?? fallback;
};

export const ENV = {
  BASE_URL: getEnvVar('BASE_URL', 'https://api.example.com'),
  GOOGLE_WEB_CLIENT_ID: getEnvVar('GOOGLE_WEB_CLIENT_ID'),
  GOOGLE_ANDROID_CLIENT_ID: getEnvVar('GOOGLE_ANDROID_CLIENT_ID'),
  GOOGLE_IOS_CLIENT_ID: getEnvVar('GOOGLE_IOS_CLIENT_ID'),
  FACEBOOK_APP_ID: getEnvVar('FACEBOOK_APP_ID'),
  APPLE_CLIENT_ID: getEnvVar('APPLE_CLIENT_ID'),
  IS_DEV: __DEV__,
};
