// Ride Result Card Component (Google Maps + Tinder Discovery Style)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { Ride, RideSearchResult } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CompatibilityBadge } from './CompatibilityBadge';
import { VerificationBadge } from '../safety/VerificationBadge';
import { formatTimeOnly, formatDateOnly, formatCurrency, getRideTypeLabel } from '../../utils/formatters';
import { formatDistance } from '../../utils/calculations';

interface RideCardProps {
  ride: Ride | RideSearchResult;
  onRequestPress?: (ride: Ride | RideSearchResult) => void;
  onCardPress?: (ride: Ride | RideSearchResult) => void;
  showJoinButton?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  onRequestPress,
  onCardPress,
  showJoinButton = true,
}) => {
  const driverName =
    (ride as any).creator_name || ride.creator?.full_name || 'Travel Companion';
  const driverAvatar =
    (ride as any).creator_avatar || ride.creator?.avatar_url || null;
  const driverRating =
    (ride as any).creator_rating || ride.creator?.rating || 4.9;
  const isVerified =
    (ride as any).creator_is_verified ?? (ride.creator?.is_phone_verified || false);

  const score = ride.compatibility_score;
  const distanceAway = ride.pickup_distance_meters
    ? formatDistance(ride.pickup_distance_meters)
    : null;

  return (
    <Card
      style={styles.card}
      onPress={onCardPress ? () => onCardPress(ride) : undefined}
    >
      {/* Top Bar: Match Score & Ride Type */}
      <View style={styles.topBar}>
        {score !== undefined ? (
          <CompatibilityBadge score={score} />
        ) : (
          <Badge label={getRideTypeLabel(ride.ride_type)} rideType={ride.ride_type} />
        )}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            {ride.ride_type === 'free'
              ? 'Free'
              : `${formatCurrency(ride.contribution_amount)}/seat`}
          </Text>
        </View>
      </View>

      {/* Driver Header */}
      <View style={styles.driverSection}>
        <Avatar url={driverAvatar} name={driverName} size={44} />
        <View style={styles.driverInfo}>
          <View style={styles.driverRow}>
            <Text style={styles.driverName} numberOfLines={1}>
              {driverName}
            </Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{Number(driverRating).toFixed(1)}</Text>
            </View>
          </View>
          <VerificationBadge isPhoneVerified={isVerified} isIdentityVerified={isVerified} />
        </View>
      </View>

      {/* Route Journey Visualizer */}
      <View style={styles.routeContainer}>
        {/* Visual Dots & Line */}
        <View style={styles.routeTrack}>
          <View style={styles.pickupDot} />
          <View style={styles.routeLine} />
          <View style={styles.destDot} />
        </View>

        {/* Location Names */}
        <View style={styles.locationNames}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>PICKUP</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {ride.pickup_name}
            </Text>
          </View>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>DESTINATION</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {ride.destination_name}
            </Text>
          </View>
        </View>
      </View>

      {/* Ride Details / Metadata Footer */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>🕒</Text>
          <Text style={styles.metaText}>
            {formatDateOnly(ride.departure_time)}, {formatTimeOnly(ride.departure_time)}
          </Text>
        </View>

        {distanceAway && (
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText}>{distanceAway} away</Text>
          </View>
        )}

        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>💺</Text>
          <Text style={styles.metaText}>
            {ride.available_seats} {ride.available_seats === 1 ? 'seat' : 'seats'} left
          </Text>
        </View>
      </View>

      {ride.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesText} numberOfLines={2}>
            "{ride.notes}"
          </Text>
        </View>
      ) : null}

      {/* Action Button */}
      {showJoinButton && onRequestPress && (
        <Button
          title="Request to Join"
          onPress={() => onRequestPress(ride)}
          variant="primary"
          size="md"
          style={styles.requestButton}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceTag: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  driverInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  driverName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
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
    fontSize: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routeTrack: {
    width: 16,
    alignItems: 'center',
    paddingVertical: 4,
    marginRight: Spacing.xs,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderStrong,
    marginVertical: 2,
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
  },
  locationNames: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationItem: {
    marginVertical: 2,
  },
  locationLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  locationText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    padding: Spacing.xs,
    paddingLeft: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: 4,
  },
  notesText: {
    ...Typography.caption,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  requestButton: {
    marginTop: Spacing.xs,
  },
});
