// Post-Ride Star Rating and Review Modal

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
import { submitRating } from '../../services/safetyService';
import { useAuth } from '../../context/AuthContext';

interface RatingModalProps {
  visible: boolean;
  rideId: string;
  toUserId: string;
  companionName: string;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  rideId,
  toUserId,
  companionName,
  onClose,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>('Punctual and great companion to travel with!');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await submitRating({
        rideId,
        fromUserId: user.id,
        toUserId,
        rating,
        review,
      });

      Alert.alert(
        'Thank You! 🌟',
        `Your rating and feedback for ${companionName} has been submitted.`,
        [{ text: 'Done', onPress: onClose }]
      );
    } catch (err: any) {
      Alert.alert('Rating Error', err.message || 'Unable to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.headerTitle}>How was your journey?</Text>
          <Text style={styles.headerSubtitle}>
            Rate your experience with {companionName}
          </Text>

          {/* 5-Star Selection */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starTouch}
              >
                <Text
                  style={[
                    styles.starIcon,
                    star <= rating ? styles.starFilled : styles.starEmpty,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingDescriptor}>
            {rating === 5 && 'Outstanding & safe!'}
            {rating === 4 && 'Very good trip'}
            {rating === 3 && 'Average'}
            {rating <= 2 && 'Needs improvement'}
          </Text>

          {/* Optional Review */}
          <Input
            label="Write a Review (Optional)"
            placeholder="Share details about punctuality, friendliness, or driving..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={3}
            containerStyle={{ marginVertical: Spacing.md }}
          />

          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={styles.submitBtn}
          />

          <Button
            title="Skip for now"
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
  headerTitle: {
    ...Typography.header2,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  starTouch: {
    padding: 4,
  },
  starIcon: {
    fontSize: 40,
  },
  starFilled: {
    color: '#EAB308', // rich gold
  },
  starEmpty: {
    color: Colors.borderStrong,
  },
  ratingDescriptor: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
});
