// src/components/PrimaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { COLORS, COMMON_STYLES } from '../utils/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ title, onPress, loading, style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[COMMON_STYLES.primaryButton, COMMON_STYLES.shadowSm, style]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.surface} />
      ) : (
        <Text style={COMMON_STYLES.primaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
