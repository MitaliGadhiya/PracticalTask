import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types';
import { Colors, FontSize, FontWeight, Spacing } from '../theme';
import HomeNavigator from './HomeNavigator';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
  count?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, label, focused, count }) => (
  <View style={styles.tabIcon}>
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icon}</Text>
      {count !== undefined && count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="♥" label="Favorites" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 0,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xs,
  },
  iconWrapper: {
    position: 'relative',
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: `${Colors.primary}30`,
  },
  icon: {
    fontSize: FontSize.xl,
    color: Colors.tabInactive,
  },
  iconActive: {
    color: Colors.tabActive,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeight.bold,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    color: Colors.tabInactive,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  tabLabelActive: {
    color: Colors.tabActive,
    fontWeight: FontWeight.semiBold,
  },
});

export default BottomTabNavigator;
