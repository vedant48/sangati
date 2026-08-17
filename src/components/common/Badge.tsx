// Reusable Badge / Tag Component

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { RideType } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'teal' | 'violet';
  rideType?: RideType;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  rideType,
  style,
  textStyle,
}) => {
  const getColors = () => {
    if (rideType) {
      switch (rideType) {
        case 'free':
          return { bg: Colors.freeRideBg, text: Colors.freeRideText };
        case 'fuel_sharing':
          return { bg: Colors.fuelShareBg, text: Colors.fuelShareText };
        case 'cab_sharing':
          return { bg: Colors.cabShareBg, text: Colors.cabShareText };
      }
    }

    switch (variant) {
      case 'primary':
        return { bg: Colors.primaryLight, text: Colors.primary };
      case 'success':
        return { bg: Colors.successLight, text: Colors.success };
      case 'warning':
        return { bg: Colors.warningLight, text: Colors.warning };
      case 'danger':
        return { bg: Colors.dangerLight, text: Colors.danger };
      case 'teal':
        return { bg: Colors.tealLight, text: Colors.teal };
      case 'violet':
        return { bg: Colors.secondaryLight, text: Colors.secondary };
      case 'neutral':
      default:
        return { bg: Colors.surfaceSubtle, text: Colors.textSecondary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.captionMedium,
    fontSize: 12,
    fontWeight: '600',
  },
});
