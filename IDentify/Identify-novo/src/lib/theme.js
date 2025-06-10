import { Platform } from 'react-native';

export const colors = {
  // Cores base
  background: '#FFFFFF',
  foreground: '#020817',
  card: '#FFFFFF',
  cardForeground: '#020817',
  popover: '#FFFFFF',
  popoverForeground: '#020817',
  primary: '#1E293B',
  primaryForeground: '#F8FAFC',
  secondary: '#F1F5F9',
  secondaryForeground: '#1E293B',
  muted: '#F1F5F9',
  mutedForeground: '#64748B',
  accent: '#F1F5F9',
  accentForeground: '#1E293B',
  destructive: '#EF4444',
  destructiveForeground: '#F8FAFC',
  border: '#E2E8F0',
  input: '#E2E8F0',
  ring: '#020817',

  // Cores da sidebar
  sidebarBackground: '#FAFAFA',
  sidebarForeground: '#404040',
  sidebarPrimary: '#1A1A1A',
  sidebarPrimaryForeground: '#FAFAFA',
  sidebarAccent: '#F5F5F5',
  sidebarAccentForeground: '#1A1A1A',
  sidebarBorder: '#E5E5E5',
  sidebarRing: '#3B82F6',

  // Cores do modo escuro
  dark: {
    background: '#020817',
    foreground: '#F8FAFC',
    card: '#020817',
    cardForeground: '#F8FAFC',
    popover: '#020817',
    popoverForeground: '#F8FAFC',
    primary: '#F8FAFC',
    primaryForeground: '#1E293B',
    secondary: '#1E293B',
    secondaryForeground: '#F8FAFC',
    muted: '#1E293B',
    mutedForeground: '#94A3B8',
    accent: '#1E293B',
    accentForeground: '#F8FAFC',
    destructive: '#7F1D1D',
    destructiveForeground: '#F8FAFC',
    border: '#1E293B',
    input: '#1E293B',
    ring: '#CBD5E1',
    sidebarBackground: '#1A1A1A',
    sidebarForeground: '#F5F5F5',
    sidebarPrimary: '#3B82F6',
    sidebarPrimaryForeground: '#FFFFFF',
    sidebarAccent: '#262626',
    sidebarAccentForeground: '#F5F5F5',
    sidebarBorder: '#262626',
    sidebarRing: '#3B82F6',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 2,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 8,
    },
  }),
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
}; 