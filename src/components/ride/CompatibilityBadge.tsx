// Compatibility Percentage Badge

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Typography } from '../../constants/theme';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    if (score >= 85) {
      return {
        bg: '#DCFCE7', // soft green
        text: '#15803D',
        label: `${score}% Match`,
      };
    } else if (score >= 65) {
      return {
        bg: '#DBEAFE', // AI Blue light
        text: '#1D4ED8',
        label: `${score}% Match`,
      };
    } else {
      return {
        bg: '#FEF3C7', // warm amber
        text: '#B45309',
        label: `${score}% Match`,
      };
    }
  };

  const { bg, text, label } = getBadgeStyle();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg },
        size === 'sm' ? styles.smallContainer : null,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: text },
          size === 'sm' ? styles.smallText : null,
        ]}
      >
        ★ {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    ...Typography.captionMedium,
    fontWeight: '700',
    fontSize: 12,
  },
  smallText: {
    fontSize: 11,
  },
});
