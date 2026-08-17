// User Avatar Component

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius } from '../../constants/theme';

interface AvatarProps {
  url?: string | null;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  name = 'User',
  size = 48,
}) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.border,
  },
  placeholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  initials: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
