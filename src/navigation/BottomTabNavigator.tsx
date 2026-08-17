// Bottom Tab Navigator (Light Theme & Minimalist Icons)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { FindRideScreen } from '../screens/search/FindRideScreen';
import { TripsScreen } from '../screens/trips/TripsScreen';
import { ChatListScreen } from '../screens/chat/ChatListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          let icon = '🏠';
          if (route.name === 'Home') icon = '🏠';
          else if (route.name === 'Explore') icon = '🔍';
          else if (route.name === 'Trips') icon = '🚗';
          else if (route.name === 'Messages') icon = '💬';
          else if (route.name === 'Profile') icon = '👤';

          return (
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: focused ? 20 : 18 }}>{icon}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Explore" component={FindRideScreen} options={{ tabBarLabel: 'Find' }} />
      <Tab.Screen name="Trips" component={TripsScreen} options={{ tabBarLabel: 'Trips' }} />
      <Tab.Screen name="Messages" component={ChatListScreen} options={{ tabBarLabel: 'Chat' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    ...Typography.captionMedium,
    fontSize: 11,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
