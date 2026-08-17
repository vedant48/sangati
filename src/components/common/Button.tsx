// Custom Button Component (Light Theme Design System)

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? Colors.borderStrong : Colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? Colors.border : Colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1.5,
          borderColor: disabled ? Colors.border : Colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? Colors.border : Colors.danger,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return { color: Colors.textInverse };
      case 'outline':
        return { color: disabled ? Colors.textMuted : Colors.primary };
      case 'ghost':
        return { color: disabled ? Colors.textMuted : Colors.textPrimary };
      default:
        return { color: Colors.textInverse };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, borderRadius: BorderRadius.sm };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, borderRadius: BorderRadius.lg };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 20, borderRadius: BorderRadius.md };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getSizeStyle(),
        getContainerStyle(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.textInverse}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              Typography.button,
              getTextStyle(),
              icon ? { marginLeft: Spacing.sm } : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
