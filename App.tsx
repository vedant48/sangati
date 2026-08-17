// Companion Ride Main Mobile Entry Point

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RideProvider } from './src/context/RideContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RideProvider>
          <NotificationProvider>
            <StatusBar style="dark" backgroundColor="#F8FAFC" />
            <AppNavigator />
          </NotificationProvider>
        </RideProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
