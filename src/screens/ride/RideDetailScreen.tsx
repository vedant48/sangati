// Ride Detail Screen

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { VerificationBadge } from '../../components/safety/VerificationBadge';
import { CompatibilityBadge } from '../../components/ride/CompatibilityBadge';
import { RouteMap } from '../../components/map/RouteMap';
import { formatTimeOnly, formatDateOnly, formatCurrency, getRideTypeLabel } from '../../utils/formatters';
import { formatDistance } from '../../utils/calculations';
import { useAuth } from '../../context/AuthContext';

export const RideDetailScreen = ({ route, navigation }: any) => {
  const { ride } = route.params;
  const { user } = useAuth();

  const driver = ride.creator || {
    full_name: ride.creator_name || 'Driver',
    avatar_url: ride.creator_avatar,
    rating: ride.creator_rating || 4.9,
    total_ratings: ride.creator_total_ratings || 10,
    is_phone_verified: ride.creator_is_verified ?? true,
    is_identity_verified: ride.creator_is_verified ?? true,
    total_trips: 28,
    bio: 'Punctual commuter. Happy to share my daily journey.',
  };

  const isOwnRide = user && ride.creator_id === user.id;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Header */}
        <RouteMap
          pickup={{ lat: ride.pickup_lat, lng: ride.pickup_lng, label: ride.pickup_name }}
          destination={{ lat: ride.destination_lat, lng: ride.destination_lng, label: ride.destination_name }}
          height={220}
        />

        {/* Driver Profile Card */}
        <Card style={styles.driverCard}>
          <View style={styles.driverRow}>
            <Avatar url={driver.avatar_url} name={driver.full_name} size={54} />
            <View style={styles.driverInfo}>
              <View style={styles.driverHeader}>
                <Text style={styles.driverName}>{driver.full_name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>{Number(driver.rating).toFixed(1)}</Text>
                </View>
              </View>
              <VerificationBadge
                isPhoneVerified={driver.is_phone_verified}
                isIdentityVerified={driver.is_identity_verified}
              />
              <Text style={styles.driverTrips}>{driver.total_trips || 20} rides completed</Text>
            </View>
          </View>
          {driver.bio && <Text style={styles.bioText}>"{driver.bio}"</Text>}
        </Card>

        {/* Trip Core Specs Card */}
        <Card style={styles.detailsCard}>
          <View style={styles.badgeRow}>
            {ride.compatibility_score !== undefined ? (
              <CompatibilityBadge score={ride.compatibility_score} />
            ) : (
              <Badge label={getRideTypeLabel(ride.ride_type)} rideType={ride.ride_type} />
            )}
            <Badge label={`${ride.available_seats} seats available`} variant="teal" />
          </View>

          {/* Route timeline */}
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.pickupDot} />
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>PICKUP</Text>
                <Text style={styles.timelineLocation}>{ride.pickup_name}</Text>
                {ride.pickup_distance_meters && (
                  <Text style={styles.timelineSub}>
                    {formatDistance(ride.pickup_distance_meters)} from your pickup
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.destDot} />
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>DESTINATION</Text>
                <Text style={styles.timelineLocation}>{ride.destination_name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Key Facts Grid */}
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>DEPARTURE TIME</Text>
              <Text style={styles.gridValue}>
                {formatDateOnly(ride.departure_time)}, {formatTimeOnly(ride.departure_time)}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>ESTIMATED CONTRIBUTION</Text>
              <Text style={styles.gridValue}>
                {ride.ride_type === 'free' ? 'Free' : `${formatCurrency(ride.contribution_amount)} / person`}
              </Text>
            </View>

            {ride.vehicle_info ? (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>VEHICLE</Text>
                <Text style={styles.gridValue}>{ride.vehicle_info}</Text>
              </View>
            ) : null}

            {ride.notes ? (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>NOTES</Text>
                <Text style={styles.gridValue}>{ride.notes}</Text>
              </View>
            ) : null}
          </View>
        </Card>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      {!isOwnRide && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPrice}>
            <Text style={styles.bottomPriceLabel}>Contribution</Text>
            <Text style={styles.bottomPriceValue}>
              {ride.ride_type === 'free' ? 'Free' : formatCurrency(ride.contribution_amount)}
            </Text>
          </View>
          <Button
            title="Request to Join"
            onPress={() => navigation.navigate('RequestToJoin', { ride })}
            size="lg"
            style={styles.bottomBtn}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  driverCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverName: {
    ...Typography.header3,
    color: Colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ratingStar: {
    color: '#CA8A04',
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    ...Typography.captionMedium,
    color: '#854D0E',
    fontWeight: '700',
  },
  driverTrips: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bioText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailsCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timeline: {
    marginVertical: Spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: Spacing.xs,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
    marginRight: Spacing.sm,
  },
  destDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    marginTop: 4,
    marginRight: Spacing.sm,
  },
  timelineTextContainer: {
    flex: 1,
  },
  timelineLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timelineLocation: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  timelineSub: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  grid: {
    gap: Spacing.md,
  },
  gridItem: {},
  gridLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  gridValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.floating,
  },
  bottomPrice: {},
  bottomPriceLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  bottomPriceValue: {
    ...Typography.header3,
    color: Colors.textPrimary,
  },
  bottomBtn: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
});
