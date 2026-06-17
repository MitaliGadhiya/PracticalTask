import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import EventListScreen from '../screens/Home/EventListScreen';
import EventDetailsScreen from '../screens/Home/EventDetailsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="EventList"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
