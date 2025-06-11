import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#123458',
  secondary: '#4a90e2',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  gray: '#6c757d',
  grayLight: '#e9ecef',
  grayDark: '#495057',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: '0px 1px 2px rgba(0,0,0,0.1)',
  md: '0px 2px 4px rgba(0,0,0,0.1)',
  lg: '0px 4px 8px rgba(0,0,0,0.1)',
  xl: '0px 8px 16px rgba(0,0,0,0.1)',
};

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    boxShadow: shadows.md,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    boxShadow: shadows.sm,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
}); 