import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.foreground,
    fontSize: theme.typography.sizes.md,
  },
  heading: {
    color: theme.colors.foreground,
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
    color: theme.colors.foreground,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  logo: {
    height: 96, // 6em
    width: 96,
    padding: 24, // 1.5em
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilos para modo escuro
  dark: {
    container: {
      backgroundColor: theme.colors.dark.background,
    },
    text: {
      color: theme.colors.dark.foreground,
    },
    heading: {
      color: theme.colors.dark.foreground,
    },
    card: {
      backgroundColor: theme.colors.dark.card,
    },
    input: {
      backgroundColor: theme.colors.dark.background,
      borderColor: theme.colors.dark.border,
      color: theme.colors.dark.foreground,
    },
  },
}); 