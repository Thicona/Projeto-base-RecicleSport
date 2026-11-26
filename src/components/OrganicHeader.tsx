// src/components/OrganicHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

const { width } = Dimensions.get('window');

interface OrganicHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
  height?: number;
}

export function OrganicHeader({
  title,
  showBackButton,
  onBack,
  rightAction,
  children,
  height = 180,
}: OrganicHeaderProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.circleRight} />
      <View style={styles.circleLeft} />

      <View style={styles.topRow}>
        {showBackButton ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color={COLORS.surface} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {rightAction}
      </View>

      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  circleRight: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: width * 0.78,
    height: 220,
    borderRadius: 140,
    backgroundColor: COLORS.primaryLight,
  },
  circleLeft: {
    position: 'absolute',
    top: -80,
    left: -55,
    width: width * 0.88,
    height: 290,
    borderRadius: 170,
    backgroundColor: COLORS.primary,
  },
  topRow: {
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    zIndex: 3,
    color: COLORS.surface,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
});
