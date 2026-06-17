declare module 'react-native-config' {
  interface NativeConfig {
    BASE_URL?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    GOOGLE_ANDROID_CLIENT_ID?: string;
    GOOGLE_IOS_CLIENT_ID?: string;
    FACEBOOK_APP_ID?: string;
    APPLE_CLIENT_ID?: string;
  }

  const Config: NativeConfig;
  export default Config;
}
