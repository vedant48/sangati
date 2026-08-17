// Safety Center & Trust Hub Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AppConfig } from '../../constants/config';
import { useAuth } from '../../context/AuthContext';
import { getBlockedUsers, unblockUser } from '../../services/safetyService';
import { BlockedUser } from '../../types';

export const SafetyCenterScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [blockedList, setBlockedList] = useState<BlockedUser[]>([]);

  useEffect(() => {
    if (user) {
      getBlockedUsers(user.id).then(setBlockedList);
    }
  }, [user]);

  const handleCall = (num: string) => {
    Linking.openURL(`tel:${num}`).catch(() => {
      Alert.alert('Calling Failed', `Please dial ${num} manually.`);
    });
  };

  const handleUnblock = async (blockedUserId: string) => {
    if (!user) return;
    try {
      await unblockUser(user.id, blockedUserId);
      setBlockedList((prev) => prev.filter((b) => b.blocked_user_id !== blockedUserId));
      Alert.alert('User Unblocked', 'You may now discover each other in ride searches.');
    } catch (e) {
      Alert.alert('Error', 'Unable to unblock user.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Safety Header */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroIcon}>🛡️</Text>
          <Text style={styles.heroTitle}>Safety Center</Text>
          <Text style={styles.heroSubtitle}>
            Your security and peace of mind are our absolute top priority.
          </Text>
        </View>

        {/* Emergency Hotlines Card */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          <Text style={styles.sectionDesc}>
            Immediate 24/7 direct access to official local emergency response services.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleCall(AppConfig.emergency.defaultHelpline)}
            style={styles.hotlineRow}
          >
            <View style={styles.hotlineLeft}>
              <Text style={styles.hotlineIcon}>🚨</Text>
              <View>
                <Text style={styles.hotlineTitle}>Universal Emergency Response (Police / Medical)</Text>
                <Text style={styles.hotlineNumber}>Dial {AppConfig.emergency.defaultHelpline}</Text>
              </View>
            </View>
            <Text style={styles.callBadge}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleCall(AppConfig.emergency.womenHelpline)}
            style={styles.hotlineRow}
          >
            <View style={styles.hotlineLeft}>
              <Text style={styles.hotlineIcon}>🌸</Text>
              <View>
                <Text style={styles.hotlineTitle}>National Women Safety Helpline</Text>
                <Text style={styles.hotlineNumber}>Dial {AppConfig.emergency.womenHelpline}</Text>
              </View>
            </View>
            <Text style={styles.callBadge}>Call</Text>
          </TouchableOpacity>
        </Card>

        {/* Emergency Contact */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <Text style={styles.sectionDesc}>
            Your designated contact who receives your live ride status during SOS alerts.
          </Text>

          {user?.emergency_contact_name ? (
            <View style={styles.contactBox}>
              <Text style={styles.contactName}>{user.emergency_contact_name}</Text>
              <Text style={styles.contactPhone}>{user.emergency_contact_phone}</Text>
              <Button
                title="Edit Contact"
                onPress={() => navigation.navigate('EditProfile')}
                variant="outline"
                size="sm"
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          ) : (
            <View style={styles.emptyContact}>
              <Text style={styles.emptyContactText}>No emergency contact configured yet.</Text>
              <Button
                title="Add Emergency Contact"
                onPress={() => navigation.navigate('EditProfile')}
                variant="primary"
                size="sm"
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          )}
        </Card>

        {/* Blocked Users */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Blocked Users ({blockedList.length})</Text>
          <Text style={styles.sectionDesc}>
            Blocked users will never be matched with you and cannot view your published rides.
          </Text>

          {blockedList.length > 0 ? (
            blockedList.map((b) => (
              <View key={b.id} style={styles.blockedRow}>
                <Text style={styles.blockedName}>
                  {b.blocked_user?.full_name || 'Blocked User'}
                </Text>
                <TouchableOpacity onPress={() => handleUnblock(b.blocked_user_id)}>
                  <Text style={styles.unblockText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noBlockedText}>You have not blocked any users.</Text>
          )}
        </Card>
      </ScrollView>
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
  heroBanner: {
    backgroundColor: '#F0FDFA', // teal soft background
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  heroIcon: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    ...Typography.header2,
    color: '#134E4A',
  },
  heroSubtitle: {
    ...Typography.body,
    color: '#0F766E',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.header3,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  hotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hotlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  hotlineIcon: {
    fontSize: 22,
    marginRight: Spacing.sm,
  },
  hotlineTitle: {
    ...Typography.captionMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hotlineNumber: {
    ...Typography.caption,
    color: Colors.danger,
    fontWeight: '600',
    marginTop: 2,
  },
  callBadge: {
    backgroundColor: Colors.dangerLight,
    color: Colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    fontWeight: '700',
    fontSize: 12,
  },
  contactBox: {
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contactPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyContact: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  emptyContactText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  blockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  blockedName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  unblockText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  noBlockedText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
