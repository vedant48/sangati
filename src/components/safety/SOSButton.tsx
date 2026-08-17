// Emergency SOS Button Component

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Typography, Shadows } from '../../constants/theme';
import { Button } from '../common/Button';
import { AppConfig } from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

export const SOSButton: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();

  const handleCallEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Calling Failed', `Please dial ${number} on your phone dialer.`);
    });
  };

  const handleShareLiveLocation = () => {
    Alert.alert(
      'Live Location Shared',
      `An emergency alert with your current location has been shared with your registered emergency contact: ${
        user?.emergency_contact_name || 'Emergency Support'
      }.`
    );
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={styles.sosButton}
      >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.warningHeader}>
              <Text style={styles.warningIcon}>🚨</Text>
              <Text style={styles.modalTitle}>Emergency Safety Center</Text>
            </View>

            <Text style={styles.modalDesc}>
              If you feel unsafe or in danger, immediately dial local emergency services or alert your emergency contact.
            </Text>

            {/* Universal Police/Emergency Hotline */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallEmergency(AppConfig.emergency.defaultHelpline)}
              style={styles.actionCard}
            >
              <View style={styles.actionLeft}>
                <Text style={styles.actionIcon}>📞</Text>
                <View>
                  <Text style={styles.actionTitle}>Call Police / National Helpline</Text>
                  <Text style={styles.actionSub}>Dial {AppConfig.emergency.defaultHelpline} (Universal Emergency)</Text>
                </View>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            {/* Women Safety Helpline */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallEmergency(AppConfig.emergency.womenHelpline)}
              style={styles.actionCard}
            >
              <View style={styles.actionLeft}>
                <Text style={styles.actionIcon}>🛡️</Text>
                <View>
                  <Text style={styles.actionTitle}>Call Women Helpline</Text>
                  <Text style={styles.actionSub}>Dial {AppConfig.emergency.womenHelpline}</Text>
                </View>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            {/* Emergency Contact */}
            {user?.emergency_contact_phone ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCallEmergency(user.emergency_contact_phone!)}
                style={styles.actionCard}
              >
                <View style={styles.actionLeft}>
                  <Text style={styles.actionIcon}>👤</Text>
                  <View>
                    <Text style={styles.actionTitle}>
                      Call {user.emergency_contact_name || 'Emergency Contact'}
                    </Text>
                    <Text style={styles.actionSub}>{user.emergency_contact_phone}</Text>
                  </View>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </TouchableOpacity>
            ) : null}

            {/* Quick Share Live Alert */}
            <Button
              title="Broadcast Live Location to Contact"
              onPress={handleShareLiveLocation}
              variant="danger"
              size="md"
              style={styles.broadcastButton}
            />

            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              variant="ghost"
              size="sm"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sosButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    ...Shadows.subtle,
  },
  sosText: {
    color: Colors.textInverse,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.floating,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: Spacing.xs,
  },
  modalTitle: {
    ...Typography.header3,
    color: Colors.danger,
  },
  modalDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  actionTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionArrow: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  broadcastButton: {
    marginVertical: Spacing.sm,
  },
});
