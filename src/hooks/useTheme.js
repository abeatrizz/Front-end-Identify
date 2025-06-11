import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { theme } from '../lib/theme';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = {
    ...theme,
    colors: isDarkMode ? theme.colors.dark : theme.colors,
  };

  return {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
  };
}; 