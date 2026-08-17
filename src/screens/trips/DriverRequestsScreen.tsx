// Driver Incoming Join Requests Management Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { VerificationBadge } from '../../components/safety/VerificationBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getDriverIncomingRequests, acceptRideRequest, rejectRideRequest } from '../../services/rideService';
import { RideRequest } from '../../types';

export const DriverRequestsScreen = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    if (!user) return;
    try {
      const items = await getDriverIncomingRequests(user.id);
      setRequests(items);
    } catch (e) {
      console.warn('Error loading driver requests:', e);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleAccept = async (request: RideRequest) => {
    if (!user) return;
    setLoadingId(request.id);
    try {
      await acceptRideRequest(request.id, user.id);
      Alert.alert(
        'Request Accepted! 🎉',
        `You have matched with ${request.passenger?.full_name || 'the passenger'}. Realtime chat is now available.`
      );
      await loadRequests();
    } catch (err: any) {
      Alert.alert('Acceptance Failed', err.message || 'Unable to accept request.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      await rejectRideRequest(requestId);
      Alert.alert('Request Declined', 'The join request has been declined.');
      await loadRequests();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unable to reject request.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        renderItem={({ item }) => {
          const passenger = item.passenger || {
            full_name: 'Passenger',
            rating: 4.9,
            total_trips: 14,
            is_phone_verified: true,
            is_identity_verified: true,
          };

          return (
            <Card style={styles.card}>
              {/* Passenger Info Header */}
              <View style={styles.passengerRow}>
                <Avatar url={passenger.avatar_url} name={passenger.full_name} size={48} />
                <View style={styles.passengerInfo}>
                  <View style={styles.nameRatingRow}>
                    <Text style={styles.passengerName}>{passenger.full_name}</Text>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingStar}>★</Text>
                      <Text style={styles.ratingText}>{Number(passenger.rating).toFixed(1)}</Text>
                    </View>
                  </View>
                  <VerificationBadge
                    isPhoneVerified={passenger.is_phone_verified}
                    isIdentityVerified={passenger.is_identity_verified}
                  />
                  <Text style={styles.tripsCount}>{passenger.total_trips || 12} trips completed</Text>
                </View>
              </View>

              {/* Seats requested */}
              <View style={styles.seatsTag}>
                <Text style={styles.seatsTagText}>
                  Requested {item.seats_requested} {item.seats_requested === 1 ? 'seat' : 'seats'}
                </Text>
              </View>

              {/* Introductory message */}
              {item.message ? (
                <View style={styles.messageBox}>
                  <Text style={styles.messageLabel}>Message from passenger:</Text>
                  <Text style={styles.messageText}>"{item.message}"</Text>
                </View>
              ) : null}

              {/* Actions */}
              <View style={styles.actionButtons}>
                <Button
                  title="Decline"
                  onPress={() => handleReject(item.id)}
                  variant="outline"
                  size="sm"
                  disabled={loadingId === item.id}
                  style={styles.declineBtn}
                />
                <Button
                  title="Accept Request"
                  onPress={() => handleAccept(item)}
                  variant="primary"
                  size="sm"
                  loading={loadingId === item.id}
                  style={styles.acceptBtn}
                />
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="No Pending Join Requests"
            description="When passengers discover your published rides and request to accompany you, their requests will appear here."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  passengerName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ratingStar: {
    color: '#CA8A04',
    fontSize: 11,
    marginRight: 2,
  },
  ratingText: {
    ...Typography.captionMedium,
    color: '#854D0E',
    fontWeight: '700',
    fontSize: 11,
  },
  tripsCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seatsTag: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seatsTagText: {
    ...Typography.captionMedium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  messageBox: {
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  messageLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    marginBottom: 2,
  },
  messageText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  declineBtn: {
    flex: 1,
  },
  acceptBtn: {
    flex: 1,
  },
});
