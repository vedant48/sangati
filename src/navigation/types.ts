// Navigation Stack and Tab Types

import { NavigatorScreenParams } from '@react-navigation/native';
import { Ride, RideSearchResult, Match, Profile } from '../types';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  FindRide: undefined;
  RideSearchResults: undefined;
  OfferRide: undefined;
  RideDetail: { ride: Ride | RideSearchResult };
  RequestToJoin: { ride: Ride | RideSearchResult };
  TripTracking: { match: Match };
  DriverRequests: undefined;
  ChatDetail: { match: Match };
  EditProfile: undefined;
  SafetyCenter: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Trips: undefined;
  Messages: undefined;
  Profile: undefined;
};
