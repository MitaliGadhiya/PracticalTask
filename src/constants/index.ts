export { Strings } from './strings';

export const APP_CONFIG = {
  defaultPageSize: 10,
  maxPageSize: 50,
  debounceDelay: 300,
  toastDuration: 3000,
  imageQuality: 0.8,
  requestTimeout: 15000,
};

export const STORAGE_KEYS = {
  authToken: '@auth_token',
  refreshToken: '@refresh_token',
  userData: '@user_data',
  favorites: '@favorites',
  onboarding: '@onboarding_complete',
};
