// Reusable Card Component with Soft Border & Shadow

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: Colors.surfaceSubtle,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          ...Shadows.card,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.card, getVariantStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
});
