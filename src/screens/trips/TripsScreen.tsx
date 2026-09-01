// Trips Screen - Active, Upcoming, and Created Rides Hub

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getUserMatches, getDriverIncomingRequests } from '../../services/rideService';
import { Match, RideRequest } from '../../types';
import { formatDateOnly, formatTimeOnly, getRideTypeLabel } from '../../utils/formatters';
import { DriverRequestsScreen } from './DriverRequestsScreen';

export const TripsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [pendingRequests, setPendingRequests] = useState<RideRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'matches' | 'requests'>('matches');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const userMatches = await getUserMatches(user.id);
      setMatches(userMatches);

      const driverReqs = await getDriverIncomingRequests(user.id);
      setPendingRequests(driverReqs);
    } catch (e) {
      console.warn('Error loading trips data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('matches')}
          style={[styles.tab, activeTab === 'matches' ? styles.tabActive : null]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'matches' ? styles.tabTextActive : null,
            ]}
          >
            My Journeys ({matches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('requests')}
          style={[styles.tab, activeTab === 'requests' ? styles.tabActive : null]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'requests' ? styles.tabTextActive : null,
            ]}
          >
            Join Requests ({pendingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'matches' ? (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          renderItem={({ item }) => {
            const isDriver = item.driver_id === user?.id;
            const companion = isDriver ? item.passenger : item.driver;
            const ride = item.ride;

            return (
              <Card
                style={styles.tripCard}
                onPress={() => navigation.navigate('TripTracking', { match: item })}
              >
                {/* Status Header */}
                <View style={styles.cardHeader}>
                  <Badge
                    label={item.status.toUpperCase()}
                    variant={item.status === 'active' ? 'success' : 'neutral'}
                  />
                  <Text style={styles.roleTag}>{isDriver ? 'You are Driver' : 'You are Passenger'}</Text>
                </View>

                {/* Companion Row */}
                <View style={styles.companionRow}>
                  <Avatar
                    url={companion?.avatar_url}
                    name={companion?.full_name || 'Companion'}
                    size={42}
                  />
                  <View style={styles.companionInfo}>
                    <Text style={styles.companionName}>
                      {companion?.full_name || 'Travel Companion'}
                    </Text>
                    <Text style={styles.tripTime}>
                      {ride?.departure_time
                        ? `${formatDateOnly(ride.departure_time)}, ${formatTimeOnly(ride.departure_time)}`
                        : 'Scheduled Ride'}
                    </Text>
                  </View>
                </View>

                {/* Route Snapshot */}
                <View style={styles.routeContainer}>
                  <Text style={styles.routeText} numberOfLines={2}>
                    📍 {ride?.pickup_name || 'Pickup'} → {ride?.destination_name || 'Destination'}
                  </Text>
                </View>

                {/* Card Actions */}
                <View style={styles.cardActions}>
                  <Button
                    title="Open Chat"
                    onPress={() => navigation.navigate('ChatDetail', { match: item })}
                    variant="outline"
                    size="sm"
                    style={{ flex: 1, marginRight: Spacing.sm }}
                  />
                  <Button
                    title="Trip Details"
                    onPress={() => navigation.navigate('TripTracking', { match: item })}
                    variant="primary"
                    size="sm"
                    style={{ flex: 1 }}
                  />
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              title="No Active Journeys"
              description="You haven't matched on any rides yet. Search for a companion or publish your upcoming journey."
              actionLabel="Find a Companion"
              onAction={() => navigation.navigate('FindRide')}
            />
          }
        />
      ) : (
        /* Join Requests Tab */
        <DriverRequestsScreen />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  tripCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  roleTag: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  companionInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  companionName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tripTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  routeContainer: {
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routeText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
