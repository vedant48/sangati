// Root Application Navigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { FindRideScreen } from '../screens/search/FindRideScreen';
import { RideSearchResultsScreen } from '../screens/search/RideSearchResultsScreen';
import { OfferRideScreen } from '../screens/offer/OfferRideScreen';
import { RideDetailScreen } from '../screens/ride/RideDetailScreen';
import { RequestToJoinModal } from '../screens/ride/RequestToJoinModal';
import { TripTrackingScreen } from '../screens/trips/TripTrackingScreen';
import { DriverRequestsScreen } from '../screens/trips/DriverRequestsScreen';
import { ChatDetailScreen } from '../screens/chat/ChatDetailScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { SafetyCenterScreen } from '../screens/profile/SafetyCenterScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/colors';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.textPrimary,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Group>
        ) : (
          // Main App Flow
          <Stack.Group>
            <Stack.Screen
              name="MainTabs"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FindRide"
              component={FindRideScreen}
              options={{ title: 'Find a Companion' }}
            />
            <Stack.Screen
              name="RideSearchResults"
              component={RideSearchResultsScreen}
              options={{ title: 'Compatible Rides' }}
            />
            <Stack.Screen
              name="OfferRide"
              component={OfferRideScreen}
              options={{ title: 'Offer a Ride' }}
            />
            <Stack.Screen
              name="RideDetail"
              component={RideDetailScreen}
              options={{ title: 'Ride Overview' }}
            />
            <Stack.Screen
              name="RequestToJoin"
              component={RequestToJoinModal}
              options={{ title: 'Request to Join', presentation: 'modal' }}
            />
            <Stack.Screen
              name="TripTracking"
              component={TripTrackingScreen}
              options={{ title: 'Live Journey' }}
            />
            <Stack.Screen
              name="DriverRequests"
              component={DriverRequestsScreen}
              options={{ title: 'Join Requests' }}
            />
            <Stack.Screen
              name="ChatDetail"
              component={ChatDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
              name="SafetyCenter"
              component={SafetyCenterScreen}
              options={{ title: 'Safety Center' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
