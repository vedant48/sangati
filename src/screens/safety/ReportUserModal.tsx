// Report Misconduct Modal

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { reportUser, blockUser } from '../../services/safetyService';
import { useAuth } from '../../context/AuthContext';
import { ReportReason } from '../../types';

interface ReportUserModalProps {
  visible: boolean;
  reportedUserId: string;
  reportedUserName: string;
  rideId?: string;
  onClose: () => void;
}

const REPORT_REASONS: Array<{ key: ReportReason; label: string }> = [
  { key: 'harassment', label: 'Harassment or Verbal Abuse' },
  { key: 'unsafe_behavior', label: 'Unsafe Driving or Conduct' },
  { key: 'inappropriate_behavior', label: 'Inappropriate or Unprofessional' },
  { key: 'fake_profile', label: 'Fake Profile / Misrepresentation' },
  { key: 'scam', label: 'Payment Scam or Overcharging' },
  { key: 'other', label: 'Other Safety Concern' },
];

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  visible,
  reportedUserId,
  reportedUserName,
  rideId,
  onClose,
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState<ReportReason>('unsafe_behavior');
  const [description, setDescription] = useState<string>('');
  const [alsoBlock, setAlsoBlock] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await reportUser({
        reporterId: user.id,
        reportedUserId,
        rideId,
        reason,
        description,
      });

      if (alsoBlock) {
        await blockUser(user.id, reportedUserId);
      }

      Alert.alert(
        'Report Submitted',
        `Thank you for helping keep the Companion Ride community safe. Our moderation team will review this report within 24 hours.`,
        [{ text: 'Close', onPress: onClose }]
      );
    } catch (err: any) {
      Alert.alert('Report Error', err.message || 'Unable to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Report User</Text>
          <Text style={styles.subtitle}>
            Reporting <Text style={{ fontWeight: '700' }}>{reportedUserName}</Text>
          </Text>

          <Text style={styles.sectionLabel}>SELECT REASON</Text>
          <View style={styles.reasonsList}>
            {REPORT_REASONS.map((r) => (
              <TouchableOpacity
                key={r.key}
                onPress={() => setReason(r.key)}
                style={[
                  styles.reasonItem,
                  reason === r.key ? styles.reasonItemActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.reasonText,
                    reason === r.key ? styles.reasonTextActive : null,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Additional Details (Optional)"
            placeholder="Please describe what happened..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            containerStyle={{ marginVertical: Spacing.sm }}
          />

          {/* Block Checkbox Toggle */}
          <TouchableOpacity
            onPress={() => setAlsoBlock(!alsoBlock)}
            style={styles.blockRow}
          >
            <Text style={styles.checkbox}>{alsoBlock ? '☑' : '☐'}</Text>
            <Text style={styles.blockText}>
              Block this user so you never get matched again
            </Text>
          </TouchableOpacity>

          <Button
            title="Submit Report"
            onPress={handleSubmit}
            loading={loading}
            variant="danger"
            size="lg"
            style={styles.submitBtn}
          />

          <Button
            title="Cancel"
            onPress={onClose}
            variant="ghost"
            size="sm"
            style={{ marginTop: Spacing.xs }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.floating,
  },
  title: {
    ...Typography.header2,
    color: Colors.danger,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  reasonsList: {
    gap: 6,
    marginBottom: Spacing.sm,
  },
  reasonItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reasonItemActive: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.danger,
  },
  reasonText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
  },
  reasonTextActive: {
    color: Colors.danger,
    fontWeight: '700',
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  checkbox: {
    fontSize: 18,
    color: Colors.danger,
    marginRight: Spacing.xs,
  },
  blockText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
});
