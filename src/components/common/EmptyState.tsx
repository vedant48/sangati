// Empty State Component with actionable tips and retry options

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  tips?: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  tips,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {tips && tips.length > 0 && (
        <View style={styles.tipsBox}>
          <Text style={styles.tipsHeading}>Try suggestions:</Text>
          {tips.map((tip, idx) => (
            <Text key={idx} style={styles.tipItem}>
              • {tip}
            </Text>
          ))}
        </View>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  iconWrapper: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  title: {
    ...Typography.header3,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  tipsBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginVertical: Spacing.sm,
  },
  tipsHeading: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipItem: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionButton: {
    marginTop: Spacing.md,
    minWidth: 180,
  },
});
