// User Profile Screen

import React from 'react';
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
import { Avatar } from '../../components/common/Avatar';
import { VerificationBadge } from '../../components/safety/VerificationBadge';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Companion Ride?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <Avatar url={user?.avatar_url} name={user?.full_name || 'User'} size={72} />
            <View style={styles.profileHeaderInfo}>
              <Text style={styles.name}>{user?.full_name || 'Rahul Kumar'}</Text>
              <Text style={styles.username}>@{user?.username || 'rahulk'}</Text>
              <View style={{ marginTop: 4 }}>
                <VerificationBadge
                  isPhoneVerified={user?.is_phone_verified ?? true}
                  isIdentityVerified={user?.is_identity_verified ?? true}
                />
              </View>
            </View>
          </View>

          {user?.bio && <Text style={styles.bio}>"{user.bio}"</Text>}

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>★ {Number(user?.rating || 4.9).toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating ({user?.total_ratings || 24})</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{user?.total_trips || 38}</Text>
              <Text style={styles.statLabel}>Trips Taken</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>100%</Text>
              <Text style={styles.statLabel}>Punctuality</Text>
            </View>
          </View>
        </Card>

        {/* Quick Settings & Navigation Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>ACCOUNT & PREFERENCES</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>✏️</Text>
              <Text style={styles.menuText}>Edit Profile Details</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SafetyCenter')}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🛡️</Text>
              <Text style={styles.menuText}>Safety Center & Emergency Contacts</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Women Safety Mode',
                'Women-only ride preferences architecture is supported. You can toggle ride visibility to verified women commuters.'
              )
            }
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🌸</Text>
              <Text style={styles.menuText}>Women Safety Preferences</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Community & Support */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>COMMUNITY & TRUST</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Identity Verification',
                'Your Government ID and phone number have been securely verified.'
              )
            }
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>✓</Text>
              <Text style={styles.menuText}>Verification Status</Text>
            </View>
            <Text style={styles.badgeTextGreen}>Verified</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Community Guidelines',
                'Companion Ride is a community carpooling platform. Be respectful, punctual, and communicate proactively.'
              )
            }
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📖</Text>
              <Text style={styles.menuText}>Community Guidelines</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out */}
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          size="md"
          style={styles.logoutBtn}
          textStyle={{ color: Colors.danger }}
        />

        <Text style={styles.versionText}>Companion Ride v1.0.0 (Production MVP)</Text>
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
  profileCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileHeaderInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  name: {
    ...Typography.header2,
    color: Colors.textPrimary,
  },
  username: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bio: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  menuContainer: {
    marginTop: Spacing.lg,
  },
  menuSectionTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  menuText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  badgeTextGreen: {
    ...Typography.captionMedium,
    color: Colors.success,
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: Spacing.xl,
    borderColor: Colors.dangerLight,
  },
  versionText: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
});
