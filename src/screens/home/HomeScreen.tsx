// Home Screen (Core Companion Ride Discovery Hub)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { RideCard } from '../../components/ride/RideCard';
import { SOSButton } from '../../components/safety/SOSButton';
import { useAuth } from '../../context/AuthContext';
import { useRideContext } from '../../context/RideContext';
import { getMockRides } from '../../services/mockRides';
import { getUserMatches } from '../../services/rideService';
import { Ride, Match } from '../../types';
import { formatDateOnly, formatTimeOnly } from '../../utils/formatters';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { setActiveMatch } = useRideContext();
  const [nearbyRides, setNearbyRides] = useState<Ride[]>([]);
  const [activeTrip, setActiveTrip] = useState<Match | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = async () => {
    try {
      const allRides = await getMockRides();
      setNearbyRides(allRides.slice(0, 3));

      if (user) {
        const matches = await getUserMatches(user.id);
        const active = matches.find((m) => m.status === 'active');
        setActiveTrip(active || null);
      }
    } catch (e) {
      console.warn('Error loading home data:', e);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleTripPress = (match: Match) => {
    setActiveMatch(match);
    navigation.navigate('TripTracking', { match });
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar with Light Brand Header */}
      <View style={styles.topBar}>
        <View style={styles.topBarUser}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarTouch}
          >
            <Avatar url={user?.avatar_url} name={user?.full_name || 'User'} size={40} />
          </TouchableOpacity>
          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>Hello, {user?.full_name?.split(' ')[0] || 'Traveler'} 👋</Text>
            <Text style={styles.taglineText}>Travelling somewhere today?</Text>
          </View>
        </View>

        <View style={styles.topBarActions}>
          <SOSButton />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {/* Core Value Proposition Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroPretitle}>COMMUNITY CARPOOLING</Text>
          <Text style={styles.heroTitle}>Someone's probably going your way.</Text>
          <Text style={styles.heroDesc}>
            Connect with verified commuters on the exact same route. Split fuel costs or travel together safely.
          </Text>

          {/* Primary Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('FindRide')}
              style={[styles.primaryActionCard, styles.findRideCard]}
            >
              <View style={styles.actionCardHeader}>
                <Text style={styles.actionCardIcon}>🔍</Text>
                <Text style={styles.actionCardTitle}>Find a Ride</Text>
              </View>
              <Text style={styles.actionCardSub}>Search people travelling your corridor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('OfferRide')}
              style={[styles.primaryActionCard, styles.offerRideCard]}
            >
              <View style={styles.actionCardHeader}>
                <Text style={styles.actionCardIcon}>🚘</Text>
                <Text style={styles.actionCardTitle}>Offer a Ride</Text>
              </View>
              <Text style={styles.actionCardSub}>Publish journey & share empty seats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active / Upcoming Trip Card (If Matched) */}
        {activeTrip && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Journey</Text>
              <TouchableOpacity onPress={() => handleTripPress(activeTrip)}>
                <Text style={styles.sectionLink}>Open Trip →</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.activeTripCard} onPress={() => handleTripPress(activeTrip)}>
              <View style={styles.activeTripStatus}>
                <View style={styles.liveIndicator} />
                <Text style={styles.activeTripStatusText}>MATCH CONFIRMED</Text>
              </View>

              <View style={styles.activeTripRoute}>
                <Text style={styles.activeTripRouteText} numberOfLines={1}>
                  {activeTrip.ride?.pickup_name || 'Pickup Point'} →{' '}
                  {activeTrip.ride?.destination_name || 'Destination'}
                </Text>
              </View>

              <View style={styles.activeTripFooter}>
                <View style={styles.activeTripCompanion}>
                  <Avatar
                    url={
                      activeTrip.driver_id === user?.id
                        ? activeTrip.passenger?.avatar_url
                        : activeTrip.driver?.avatar_url
                    }
                    name={
                      activeTrip.driver_id === user?.id
                        ? activeTrip.passenger?.full_name || 'Passenger'
                        : activeTrip.driver?.full_name || 'Driver'
                    }
                    size={32}
                  />
                  <Text style={styles.companionName}>
                    {activeTrip.driver_id === user?.id
                      ? `Passenger: ${activeTrip.passenger?.full_name || 'User'}`
                      : `Driver: ${activeTrip.driver?.full_name || 'Driver'}`}
                  </Text>
                </View>

                <Button
                  title="View Live Trip"
                  onPress={() => handleTripPress(activeTrip)}
                  size="sm"
                  variant="primary"
                />
              </View>
            </Card>
          </View>
        )}

        {/* Nearby Ride Suggestions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Corridor Rides</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FindRide')}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {nearbyRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onRequestPress={() => navigation.navigate('RequestToJoin', { ride })}
              onCardPress={() => navigation.navigate('RideDetail', { ride })}
            />
          ))}
        </View>

        {/* Safety First Highlight */}
        <Card style={styles.safetyCard} variant="flat">
          <View style={styles.safetyHeader}>
            <Text style={styles.safetyShieldIcon}>🛡️</Text>
            <View style={styles.safetyHeaderText}>
              <Text style={styles.safetyTitle}>Safety is our first priority</Text>
              <Text style={styles.safetyDesc}>
                All profiles are verified with phone numbers and government IDs. Track live rides and share status with loved ones.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SafetyCenter')}
            style={styles.safetyActionBtn}
          >
            <Text style={styles.safetyActionText}>Explore Safety Features →</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topBarUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarTouch: {
    marginRight: Spacing.sm,
  },
  greetingBox: {},
  greetingText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  taglineText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  heroBanner: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  heroPretitle: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  heroTitle: {
    ...Typography.header2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  heroDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  primaryActionCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  findRideCard: {
    backgroundColor: '#EFF6FF', // subtle blue tint
    borderColor: '#BFDBFE',
  },
  offerRideCard: {
    backgroundColor: '#FAF5FF', // subtle purple tint
    borderColor: '#E9D5FF',
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionCardIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionCardTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionCardSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  sectionContainer: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.header3,
    color: Colors.textPrimary,
  },
  sectionLink: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  activeTripCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  activeTripStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  activeTripStatusText: {
    ...Typography.captionMedium,
    color: Colors.success,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  activeTripRoute: {
    marginVertical: Spacing.xs,
  },
  activeTripRouteText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activeTripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  activeTripCompanion: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companionName: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
  },
  safetyCard: {
    marginTop: Spacing.lg,
    backgroundColor: '#F0FDFA', // teal subtle tint
    borderColor: '#CCFBF1',
    borderWidth: 1,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safetyShieldIcon: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  safetyHeaderText: {
    flex: 1,
  },
  safetyTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: '#134E4A',
    marginBottom: 2,
  },
  safetyDesc: {
    ...Typography.caption,
    color: '#115E59',
    lineHeight: 18,
  },
  safetyActionBtn: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  safetyActionText: {
    ...Typography.captionMedium,
    color: Colors.teal,
    fontWeight: '700',
  },
});
