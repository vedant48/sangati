// Chat Messages List Screen

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
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getUserMatches } from '../../services/rideService';
import { Match } from '../../types';
import { formatTimeOnly } from '../../utils/formatters';

export const ChatListScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = async () => {
    if (!user) return;
    try {
      const userMatches = await getUserMatches(user.id);
      setMatches(userMatches);
    } catch (e) {
      console.warn('Error loading chats:', e);
    }
  };

  useEffect(() => {
    loadChats();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
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

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ChatDetail', { match: item })}
              style={styles.chatItem}
            >
              <Avatar
                url={companion?.avatar_url}
                name={companion?.full_name || 'Companion'}
                size={50}
              />
              <View style={styles.chatContent}>
                <View style={styles.topRow}>
                  <Text style={styles.companionName}>
                    {companion?.full_name || 'Travel Companion'}
                  </Text>
                  <Text style={styles.timeText}>{formatTimeOnly(item.matched_at)}</Text>
                </View>

                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.last_message?.message ||
                    `Matched for ride: ${item.ride?.destination_name.split(',')[0] || 'Journey'}`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="No Messages Yet"
            description="When you match with a companion or accept a ride join request, your private 1-on-1 chat will appear here."
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
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  companionName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  lastMessage: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
