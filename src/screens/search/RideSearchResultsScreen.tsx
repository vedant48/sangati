// Ride Search Results Screen with PostGIS Compatibility Ranking

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { RideCard } from '../../components/ride/RideCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useRideContext } from '../../context/RideContext';
import { RideSearchResult } from '../../types';

export const RideSearchResultsScreen = ({ navigation }: any) => {
  const { searchResults, lastSearch } = useRideContext();
  const [filterType, setFilterType] = useState<'all' | 'free' | 'fuel'>('all');

  const filteredResults = searchResults.filter((r) => {
    if (filterType === 'free') return r.ride_type === 'free';
    if (filterType === 'fuel') return r.ride_type === 'fuel_sharing';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Route Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerRouteRow}>
          <Text style={styles.headerPickup} numberOfLines={1}>
            {lastSearch?.pickup.name.split(',')[0] || 'Pickup'}
          </Text>
          <Text style={styles.headerArrow}> → </Text>
          <Text style={styles.headerDest} numberOfLines={1}>
            {lastSearch?.destination.name.split(',')[0] || 'Destination'}
          </Text>
        </View>
        <Text style={styles.headerMeta}>
          {searchResults.length} {searchResults.length === 1 ? 'companion' : 'companions'} found • Ranked by compatibility
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {[
          { label: 'All Rides', key: 'all' },
          { label: 'Free Only', key: 'free' },
          { label: 'Fuel Share', key: 'fuel' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setFilterType(tab.key as any)}
            style={[
              styles.filterTab,
              filterType === tab.key ? styles.filterTabActive : null,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === tab.key ? styles.filterTabTextActive : null,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results List */}
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <RideCard
            ride={item}
            onRequestPress={() => navigation.navigate('RequestToJoin', { ride: item })}
            onCardPress={() => navigation.navigate('RideDetail', { ride: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Compatible Rides Found"
            description="We couldn't find active rides matching this exact corridor and departure time window."
            tips={[
              'Try expanding your departure time window (±60 minutes)',
              'Check slightly broader pickup spots (e.g. nearby metro or major bus station)',
              'Or publish your own journey so others can discover and accompany you!',
            ]}
            actionLabel="Offer a Ride Instead"
            onAction={() => navigation.navigate('OfferRide')}
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
  headerBanner: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPickup: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  headerArrow: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
  },
  headerDest: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  headerMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    gap: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  filterTabText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
