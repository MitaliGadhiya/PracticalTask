export const Endpoints = {
  // Auth
  login: '/login',
  socialLogin: '/social-login',
  logout: '/logout',
  refreshToken: '/refresh-token',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Events
  events: '/events-listing',
  eventById: (id: string) => `/events/${id}`,
  featuredEvents: '/events/featured',
  eventCategories: '/events/categories',

  // User
  profile: '/user/profile',
  updateProfile: '/user/profile',
};
