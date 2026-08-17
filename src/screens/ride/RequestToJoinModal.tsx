// Request to Join Ride Flow Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { requestToJoinRide } from '../../services/rideService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatTimeOnly } from '../../utils/formatters';

export const RequestToJoinModal = ({ route, navigation }: any) => {
  const { ride } = route.params;
  const { user } = useAuth();

  const driverName = ride.creator_name || ride.creator?.full_name || 'Driver';
  const driverAvatar = ride.creator_avatar || ride.creator?.avatar_url;

  const [seatsRequested, setSeatsRequested] = useState<number>(1);
  const [message, setMessage] = useState<string>(
    `Hi ${driverName.split(' ')[0]}, I'm travelling towards ${ride.destination_name.split(',')[0]} around the same time and would like to join your ride!`
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to submit a ride join request.');
      return;
    }

    if (user.id === ride.creator_id) {
      Alert.alert('Action Not Allowed', 'You cannot request to join your own ride.');
      return;
    }

    setLoading(true);
    try {
      await requestToJoinRide({
        rideId: ride.id,
        passengerId: user.id,
        seatsRequested,
        message,
      });

      Alert.alert(
        'Request Sent! 📨',
        `Your request has been sent to ${driverName}. You will receive a notification as soon as they accept.`,
        [
          {
            text: 'View My Trips',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'Trips' });
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Request Failed', err.message || 'Unable to submit join request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Journey</Text>
          <Text style={styles.subtitle}>
            Send a join request with an introductory note.
          </Text>
        </View>

        {/* Ride Snapshot Card */}
        <Card style={styles.snapshotCard}>
          <View style={styles.driverRow}>
            <Avatar url={driverAvatar} name={driverName} size={44} />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driverName}</Text>
              <Text style={styles.departureMeta}>
                Departure: {formatTimeOnly(ride.departure_time)} • {ride.available_seats} seats left
              </Text>
            </View>
          </View>

          <View style={styles.routeSummary}>
            <Text style={styles.routeText} numberOfLines={2}>
              📍 {ride.pickup_name} → {ride.destination_name}
            </Text>
          </View>
        </Card>

        {/* Form Card */}
        <Card style={styles.formCard}>
          {/* Seats Counter */}
          <View style={styles.seatsRow}>
            <View>
              <Text style={styles.fieldLabel}>SEATS REQUESTED</Text>
              <Text style={styles.fieldHint}>
                Estimated: {ride.ride_type === 'free' ? 'Free' : formatCurrency(ride.contribution_amount * seatsRequested)}
              </Text>
            </View>

            <View style={styles.counter}>
              <TouchableOpacity
                onPress={() => setSeatsRequested(Math.max(1, seatsRequested - 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{seatsRequested}</Text>
              <TouchableOpacity
                onPress={() =>
                  setSeatsRequested(Math.min(ride.available_seats, seatsRequested + 1))
                }
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Introductory Message */}
          <Input
            label="Message to Driver"
            placeholder="Say hello, mention your exact pickup spot..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            containerStyle={{ marginTop: Spacing.md }}
          />

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>🤝 Community Trust</Text>
            <Text style={styles.noteBody}>
              Once accepted, you'll be matched in a 1-on-1 realtime chat to coordinate exact pickup spots and live timing.
            </Text>
          </View>

          <Button
            title="Send Join Request"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={styles.submitBtn}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  snapshotCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  driverName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  departureMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  routeSummary: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  routeText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  fieldHint: {
    ...Typography.captionMedium,
    color: Colors.primary,
    marginTop: 2,
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
  noteBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  noteTitle: {
    ...Typography.captionMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  noteBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
});
