// Find a Ride - A -> B Search Flow Screen

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
import { Button } from '../../components/common/Button';
import { LocationPickerModal } from '../../components/ride/LocationPickerModal';
import { RouteMap } from '../../components/map/RouteMap';
import { LocationCoordinate } from '../../types';
import { useRideContext } from '../../context/RideContext';
import { searchMatchingRides } from '../../services/matchingService';
import { useAuth } from '../../context/AuthContext';

export const FindRideScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { setLastSearch, setSearchResults } = useRideContext();

  const [pickup, setPickup] = useState<LocationCoordinate>({
    name: '100ft Road, Indiranagar, Bangalore',
    latitude: 12.9784,
    longitude: 77.6408,
  });

  const [destination, setDestination] = useState<LocationCoordinate>({
    name: 'ITPL Main Gate, Whitefield, Bangalore',
    latitude: 12.9866,
    longitude: 77.7376,
  });

  const [seatsNeeded, setSeatsNeeded] = useState<number>(1);
  const [pickupRadiusKm, setPickupRadiusKm] = useState<number>(3.0);
  const [timeWindowMinutes, setTimeWindowMinutes] = useState<number>(60);
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(1); // e.g. +1 hour

  const [modalType, setModalType] = useState<'pickup' | 'dest' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pickup.name || !destination.name) {
      Alert.alert('Missing Location', 'Please select both pickup and destination.');
      return;
    }

    setLoading(true);
    try {
      const departureTime = new Date(Date.now() + timeOffsetHours * 60 * 60 * 1000);
      const filters = {
        pickup,
        destination,
        departureTime,
        seatsNeeded,
        pickupRadiusKm,
        timeWindowMinutes,
      };

      setLastSearch(filters);
      const results = await searchMatchingRides(filters, user?.id);
      setSearchResults(results);
      navigation.navigate('RideSearchResults');
    } catch (err: any) {
      Alert.alert('Search Error', err.message || 'Unable to fetch matching rides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Where are you going?</Text>
          <Text style={styles.subtitle}>
            Find commuters travelling along your exact corridor.
          </Text>
        </View>

        {/* Search Parameters Form Card */}
        <Card style={styles.formCard}>
          {/* Pickup Selection */}
          <Text style={styles.fieldLabel}>FROM / PICKUP POINT</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalType('pickup')}
            style={styles.locationSelector}
          >
            <View style={styles.pickupDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {pickup.name || 'Select pickup point'}
            </Text>
            <Text style={styles.changeAction}>Edit</Text>
          </TouchableOpacity>

          {/* Swap Indicator / Connector */}
          <View style={styles.connectorRow}>
            <View style={styles.connectorLine} />
            <TouchableOpacity
              style={styles.swapBtn}
              onPress={() => {
                const temp = pickup;
                setPickup(destination);
                setDestination(temp);
              }}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* Destination Selection */}
          <Text style={styles.fieldLabel}>TO / DESTINATION</Text>
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

          {/* Departure Time Offset Selection */}
          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>DEPARTURE TIME</Text>
          <View style={styles.timePillsRow}>
            {[
              { label: 'In 30m', hours: 0.5 },
              { label: 'In 1h', hours: 1 },
              { label: 'In 2h', hours: 2 },
              { label: 'Today Evening', hours: 4 },
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

          {/* Passengers / Seats Counter */}
          <View style={styles.passengersRow}>
            <View>
              <Text style={styles.fieldLabel}>PASSENGERS</Text>
              <Text style={styles.passengerHint}>Number of seats you require</Text>
            </View>

            <View style={styles.counter}>
              <TouchableOpacity
                onPress={() => setSeatsNeeded(Math.max(1, seatsNeeded - 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{seatsNeeded}</Text>
              <TouchableOpacity
                onPress={() => setSeatsNeeded(Math.min(4, seatsNeeded + 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search CTA */}
          <Button
            title="Find Companions"
            onPress={handleSearch}
            loading={loading}
            size="lg"
            style={styles.searchBtn}
          />
        </Card>

        {/* Live Route Preview Map */}
        <View style={styles.mapSection}>
          <Text style={styles.mapSectionTitle}>Route Overview</Text>
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
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 24,
  },
  connectorLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.borderStrong,
    marginLeft: 4,
  },
  swapBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapIcon: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
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
  searchBtn: {
    marginTop: Spacing.md,
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
