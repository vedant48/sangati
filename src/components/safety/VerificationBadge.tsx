// Verification Badge for Profile & Driver Cards

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Typography } from '../../constants/theme';

interface VerificationBadgeProps {
  isPhoneVerified?: boolean;
  isIdentityVerified?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isPhoneVerified = false,
  isIdentityVerified = false,
}) => {
  if (!isPhoneVerified && !isIdentityVerified) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.text}>
        {isIdentityVerified ? 'ID & Phone Verified' : 'Phone Verified'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    color: Colors.teal,
    fontWeight: '800',
    fontSize: 11,
    marginRight: 4,
  },
  text: {
    ...Typography.captionMedium,
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '600',
  },
});
