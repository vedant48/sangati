// Trip Tracking and Realtime Journey Management Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { RouteMap } from '../../components/map/RouteMap';
import { SOSButton } from '../../components/safety/SOSButton';
import { RatingModal } from './RatingModal';
import { ReportUserModal } from '../safety/ReportUserModal';
import { useAuth } from '../../context/AuthContext';
import { updateRideStatus } from '../../services/rideService';
import { Match, RideStatus } from '../../types';
import { formatDateOnly, formatTimeOnly, formatCurrency } from '../../utils/formatters';

export const TripTrackingScreen = ({ route, navigation }: any) => {
  const { match } = route.params;
  const { user } = useAuth();

  const isDriver = user && match.driver_id === user.id;
  const companion = isDriver ? match.passenger : match.driver;
  const ride = match.ride;

  const [tripStatus, setTripStatus] = useState<RideStatus>(ride?.status || 'active');
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStartTrip = async () => {
    setLoading(true);
    try {
      if (ride) await updateRideStatus(ride.id, 'started');
      setTripStatus('started');
      Alert.alert('Trip Started 🚗', 'Drive safely! Realtime tracking is active.');
    } catch (e) {
      Alert.alert('Error', 'Unable to start trip.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    setLoading(true);
    try {
      if (ride) await updateRideStatus(ride.id, 'completed');
      setTripStatus('completed');
      setShowRatingModal(true);
    } catch (e) {
      Alert.alert('Error', 'Unable to complete trip.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = () => {
    Alert.alert(
      'Cancel Journey',
      'Are you sure you want to cancel this match? Your companion will be notified immediately.',
      [
        { text: 'No, Keep Trip', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            if (ride) await updateRideStatus(ride.id, 'cancelled');
            setTripStatus('cancelled');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleShareTrip = async () => {
    try {
      const shareMessage = `🚗 Companion Ride Live Journey:
Travelling from ${ride?.pickup_name || 'Pickup'} to ${ride?.destination_name || 'Destination'}.
Companion: ${companion?.full_name || 'Verified Commuter'}.
Departure: ${ride?.departure_time ? formatTimeOnly(ride.departure_time) : 'Now'}.
Status: ${tripStatus.toUpperCase()}`;

      await Share.share({
        message: shareMessage,
        title: 'Companion Ride Trip Details',
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header with Status & SOS */}
        <View style={styles.topBar}>
          <View style={styles.statusBox}>
            <View
              style={[
                styles.statusDot,
                tripStatus === 'started'
                  ? styles.statusDotLive
                  : tripStatus === 'completed'
                  ? styles.statusDotComplete
                  : styles.statusDotActive,
              ]}
            />
            <Text style={styles.statusText}>STATUS: {tripStatus.toUpperCase()}</Text>
          </View>
          <SOSButton />
        </View>

        {/* Live Route Map */}
        <RouteMap
          pickup={
            ride ? { lat: ride.pickup_lat, lng: ride.pickup_lng, label: ride.pickup_name } : undefined
          }
          destination={
            ride
              ? { lat: ride.destination_lat, lng: ride.destination_lng, label: ride.destination_name }
              : undefined
          }
          height={200}
        />

        {/* Companion Details Card */}
        <Card style={styles.companionCard}>
          <View style={styles.companionRow}>
            <Avatar url={companion?.avatar_url} name={companion?.full_name} size={50} />
            <View style={styles.companionInfo}>
              <Text style={styles.roleLabel}>{isDriver ? 'YOUR PASSENGER' : 'YOUR DRIVER'}</Text>
              <Text style={styles.companionName}>{companion?.full_name || 'Travel Companion'}</Text>
              <Text style={styles.companionRating}>★ {Number(companion?.rating || 4.9).toFixed(1)} Rating</Text>
            </View>
          </View>

          <View style={styles.companionActions}>
            <Button
              title="Open Chat"
              onPress={() => navigation.navigate('ChatDetail', { match })}
              variant="outline"
              size="sm"
              icon={<Text>💬</Text>}
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
            <Button
              title="Share Trip"
              onPress={handleShareTrip}
              variant="outline"
              size="sm"
              icon={<Text>🔗</Text>}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* Journey Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionHeading}>Trip Details</Text>

          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.pickupDot} />
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>PICKUP</Text>
                <Text style={styles.timelineLocation}>{ride?.pickup_name}</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.destDot} />
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineLabel}>DESTINATION</Text>
                <Text style={styles.timelineLocation}>{ride?.destination_name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>DEPARTURE</Text>
              <Text style={styles.metaVal}>
                {ride?.departure_time
                  ? `${formatDateOnly(ride.departure_time)}, ${formatTimeOnly(ride.departure_time)}`
                  : 'Today'}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>ESTIMATED CONTRIBUTION</Text>
              <Text style={styles.metaVal}>
                {ride?.ride_type === 'free' ? 'Free' : formatCurrency(ride?.contribution_amount || 0)}
              </Text>
            </View>
          </View>

          {ride?.vehicle_info ? (
            <View style={styles.vehicleBox}>
              <Text style={styles.vehicleLabel}>VEHICLE INFO</Text>
              <Text style={styles.vehicleText}>🚗 {ride.vehicle_info}</Text>
            </View>
          ) : null}
        </Card>

        {/* Driver / Participant Controls */}
        <View style={styles.actionsContainer}>
          {isDriver && tripStatus === 'active' && (
            <Button
              title="Start Trip"
              onPress={handleStartTrip}
              loading={loading}
              variant="primary"
              size="lg"
              style={styles.mainActionBtn}
            />
          )}

          {tripStatus === 'started' && (
            <Button
              title="Complete Trip & Rate"
              onPress={handleCompleteTrip}
              loading={loading}
              variant="primary"
              size="lg"
              style={styles.mainActionBtn}
            />
          )}

          {tripStatus !== 'completed' && (
            <Button
              title="Cancel Journey"
              onPress={handleCancelTrip}
              variant="danger"
              size="md"
              style={styles.cancelBtn}
            />
          )}

          <TouchableOpacity
            onPress={() => setShowReportModal(true)}
            style={styles.reportBtn}
          >
            <Text style={styles.reportBtnText}>⚠️ Report an issue with this trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Post-Ride Rating Modal */}
      {showRatingModal && (
        <RatingModal
          visible={showRatingModal}
          rideId={ride?.id || match.ride_id}
          toUserId={companion?.id || (isDriver ? match.passenger_id : match.driver_id)}
          companionName={companion?.full_name || 'Companion'}
          onClose={() => {
            setShowRatingModal(false);
            navigation.navigate('Home');
          }}
        />
      )}

      {/* Safety Report Modal */}
      {showReportModal && (
        <ReportUserModal
          visible={showReportModal}
          reportedUserId={companion?.id || (isDriver ? match.passenger_id : match.driver_id)}
          reportedUserName={companion?.full_name || 'User'}
          rideId={ride?.id}
          onClose={() => setShowReportModal(false)}
        />
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
    paddingBottom: Spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotActive: { backgroundColor: Colors.primary },
  statusDotLive: { backgroundColor: Colors.success },
  statusDotComplete: { backgroundColor: Colors.textMuted },
  statusText: {
    ...Typography.captionMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontSize: 11,
  },
  companionCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companionInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  roleLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  companionName: {
    ...Typography.header3,
    color: Colors.textPrimary,
  },
  companionRating: {
    ...Typography.captionMedium,
    color: '#B45309',
    marginTop: 2,
  },
  companionActions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailsCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
  },
  sectionHeading: {
    ...Typography.header3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  timeline: {
    marginVertical: Spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 4,
    marginRight: Spacing.sm,
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
    fontWeight: '700',
    color: Colors.textMuted,
  },
  timelineLocation: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  metaVal: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  vehicleBox: {
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vehicleLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  vehicleText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  actionsContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  mainActionBtn: {
    marginBottom: Spacing.xs,
  },
  cancelBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  reportBtn: {
    alignSelf: 'center',
    padding: Spacing.sm,
  },
  reportBtnText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
