// src/utils/theme.ts
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#21B086',
  primaryDark: '#16A07A',
  primaryAlt: '#23B584',
  primaryLight: '#95DFC9',
  primarySoft: '#D2F4EA',
  surface: '#FFFFFF',
  surfaceAlt: '#F7FAF9',
  cardBg: '#F9FAFB',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  darkBrand: '#13222A',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 30,
  round: 999,
} as const;

export const COMMON_STYLES = StyleSheet.create({
  shadowSm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  shadowMd: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
