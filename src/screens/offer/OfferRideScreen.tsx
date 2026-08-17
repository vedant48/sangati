// Offer a Ride Flow Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LocationPickerModal } from '../../components/ride/LocationPickerModal';
import { RouteMap } from '../../components/map/RouteMap';
import { LocationCoordinate, RideType } from '../../types';
import { createRide } from '../../services/rideService';
import { useAuth } from '../../context/AuthContext';
import { validateRideCreation } from '../../utils/validation';

export const OfferRideScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const [pickup, setPickup] = useState<LocationCoordinate>({
    name: 'Connaught Place Inner Circle, Delhi',
    latitude: 28.6315,
    longitude: 77.2167,
  });

  const [destination, setDestination] = useState<LocationCoordinate>({
    name: 'Cyber Hub, DLF Cyber City, Gurgaon',
    latitude: 28.4950,
    longitude: 77.0895,
  });

  const [availableSeats, setAvailableSeats] = useState<number>(3);
  const [rideType, setRideType] = useState<RideType>('fuel_sharing');
  const [contributionAmount, setContributionAmount] = useState<string>('120');
  const [notes, setNotes] = useState<string>('Daily office commute. Fastag enabled, toll split included.');
  const [vehicleInfo, setVehicleInfo] = useState<string>('Maruti Baleno (DL-8C-XY-9012)');
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(2);

  const [modalType, setModalType] = useState<'pickup' | 'dest' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePublish = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to offer a ride.');
      return;
    }

    const departureTime = new Date(Date.now() + timeOffsetHours * 60 * 60 * 1000);
    const numContribution = rideType === 'free' ? 0 : parseFloat(contributionAmount) || 0;

    const validation = validateRideCreation({
      pickupName: pickup.name,
      pickupLat: pickup.latitude,
      pickupLng: pickup.longitude,
      destName: destination.name,
      destLat: destination.latitude,
      destLng: destination.longitude,
      departureTime,
      availableSeats,
      contributionAmount: numContribution,
      rideType,
    });

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.error || 'Please verify form fields.');
      return;
    }

    setLoading(true);
    try {
      const created = await createRide({
        creatorId: user.id,
        pickupName: pickup.name,
        pickupLat: pickup.latitude,
        pickupLng: pickup.longitude,
        destinationName: destination.name,
        destinationLat: destination.latitude,
        destinationLng: destination.longitude,
        departureTime,
        availableSeats,
        totalSeats: availableSeats + 1,
        rideType,
        contributionAmount: numContribution,
        notes,
        vehicleInfo,
      });

      Alert.alert(
        'Ride Published! 🚀',
        'Your journey is live. Nearby commuters travelling along your route can now discover and request to accompany you.',
        [
          {
            text: 'View Ride',
            onPress: () => navigation.navigate('RideDetail', { ride: created }),
          },
          {
            text: 'Go to Home',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Publish Failed', err.message || 'Unable to publish ride.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Offer a Ride</Text>
          <Text style={styles.subtitle}>
            Publish your journey and share empty seats with verified commuters.
          </Text>
        </View>

        <Card style={styles.formCard}>
          {/* Pickup Selection */}
          <Text style={styles.fieldLabel}>STARTING LOCATION / PICKUP</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalType('pickup')}
            style={styles.locationSelector}
          >
            <View style={styles.pickupDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {pickup.name || 'Select starting point'}
            </Text>
            <Text style={styles.changeAction}>Edit</Text>
          </TouchableOpacity>

          {/* Destination Selection */}
          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>DESTINATION</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalType('dest')}
            style={styles.locationSelector}
          >
            <View style={styles.destDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {destination.name || 'Select destination'}
            </Text>
            <Text style={styles.changeAction}>Edit</Text>
          </TouchableOpacity>

          {/* Departure Time */}
          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>DEPARTURE TIME</Text>
          <View style={styles.timePillsRow}>
            {[
              { label: 'In 30 mins', hours: 0.5 },
              { label: 'In 1 hour', hours: 1 },
              { label: 'In 2 hours', hours: 2 },
              { label: 'In 4 hours', hours: 4 },
            ].map((pill) => (
              <TouchableOpacity
                key={pill.label}
                onPress={() => setTimeOffsetHours(pill.hours)}
                style={[
                  styles.pill,
                  timeOffsetHours === pill.hours ? styles.pillActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    timeOffsetHours === pill.hours ? styles.pillTextActive : null,
                  ]}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Available Seats */}
          <View style={styles.passengersRow}>
            <View>
              <Text style={styles.fieldLabel}>AVAILABLE SEATS</Text>
              <Text style={styles.passengerHint}>Seats you are offering</Text>
            </View>

            <View style={styles.counter}>
              <TouchableOpacity
                onPress={() => setAvailableSeats(Math.max(1, availableSeats - 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{availableSeats}</Text>
              <TouchableOpacity
                onPress={() => setAvailableSeats(Math.min(6, availableSeats + 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ride Type Selection */}
          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>RIDE TYPE</Text>
          <View style={styles.rideTypesRow}>
            {[
              { key: 'free', label: 'Free Ride', desc: 'No cost sharing' },
              { key: 'fuel_sharing', label: 'Fuel Sharing', desc: 'Split fuel expense' },
              { key: 'cab_sharing', label: 'Cab Sharing', desc: 'Split taxi fare' },
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                onPress={() => {
                  setRideType(type.key as any);
                  if (type.key === 'free') setContributionAmount('0');
                }}
                style={[
                  styles.rideTypeCard,
                  rideType === type.key ? styles.rideTypeCardActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.rideTypeLabel,
                    rideType === type.key ? styles.rideTypeLabelActive : null,
                  ]}
                >
                  {type.label}
                </Text>
                <Text style={styles.rideTypeDesc}>{type.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contribution Amount (If not Free) */}
          {rideType !== 'free' && (
            <Input
              label="Estimated Contribution (₹ per seat)"
              placeholder="e.g. 100"
              value={contributionAmount}
              onChangeText={setContributionAmount}
              keyboardType="numeric"
              leftIcon={<Text>₹</Text>}
            />
          )}

          {/* Vehicle Info */}
          <Input
            label="Vehicle Details (Optional)"
            placeholder="e.g. White Swift (KA-01-AB-1234)"
            value={vehicleInfo}
            onChangeText={setVehicleInfo}
            leftIcon={<Text>🚗</Text>}
          />

          {/* Notes */}
          <Input
            label="Trip Notes / Preferences (Optional)"
            placeholder="e.g. Non-smokers, AC on, luggage space available"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          <Button
            title="Publish Ride"
            onPress={handlePublish}
            loading={loading}
            size="lg"
            style={styles.publishBtn}
          />
        </Card>

        {/* Map Preview */}
        <View style={styles.mapSection}>
          <Text style={styles.mapSectionTitle}>Route Preview</Text>
          <RouteMap
            pickup={{ lat: pickup.latitude, lng: pickup.longitude, label: pickup.name }}
            destination={{ lat: destination.latitude, lng: destination.longitude, label: destination.name }}
            height={180}
          />
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={modalType !== null}
        title={modalType === 'pickup' ? 'Choose Pickup Point' : 'Choose Destination'}
        onClose={() => setModalType(null)}
        onSelectLocation={(loc) => {
          if (modalType === 'pickup') setPickup(loc);
          if (modalType === 'dest') setDestination(loc);
        }}
      />
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
  header: {
    marginVertical: Spacing.md,
  },
  title: {
    ...Typography.header1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.card,
  },
  fieldLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    marginRight: Spacing.sm,
  },
  locationText: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  changeAction: {
    ...Typography.captionMedium,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  timePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  pill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  pillText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  passengersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  passengerHint: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counterBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  counterValue: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
  },
  rideTypesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  rideTypeCard: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rideTypeCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  rideTypeLabel: {
    ...Typography.captionMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rideTypeLabelActive: {
    color: Colors.primary,
  },
  rideTypeDesc: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  publishBtn: {
    marginTop: Spacing.lg,
  },
  mapSection: {
    marginTop: Spacing.lg,
  },
  mapSectionTitle: {
    ...Typography.header3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
});
