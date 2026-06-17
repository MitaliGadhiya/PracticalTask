import { Event } from './event';

export type AuthStackParamList = {
  Login: undefined;
  SocialLogin: undefined;
};

export type HomeStackParamList = {
  EventList: undefined;
  EventDetails: { event: Event };
};

export type BottomTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};
