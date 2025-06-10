import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomNavigation = memo(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const navItems = [
    { icon: 'home', label: 'Início', path: 'Dashboard' },
    { icon: 'folder', label: 'Casos', path: 'Cases' },
    { icon: 'file-text', label: 'Laudos', path: 'Laudos' },
    { icon: 'bar-chart-2', label: 'Relatórios', path: 'Relatorios' },
    { icon: 'user', label: 'Perfil', path: 'Profile' },
  ];

  const isActive = useCallback((path) => {
    return route.name === path || 
           (path === 'Cases' && route.name.startsWith('Cases')) ||
           (path === 'Laudos' && route.name.startsWith('Laudos')) ||
           (path === 'Relatorios' && route.name.startsWith('Relatorios'));
  }, [route.name]);

  const handleNavigation = useCallback((path) => {
    navigation.navigate(path);
  }, [navigation]);

  const renderNavItem = useCallback((item) => {
    const active = isActive(item.path);
    return (
      <TouchableOpacity
        key={item.path}
        onPress={() => handleNavigation(item.path)}
        style={[
          styles.navItem,
          active ? styles.activeItem : styles.inactiveItem
        ]}
        activeOpacity={0.7}
      >
        <Feather 
          name={item.icon}
          size={20} 
          color={active ? '#2563eb' : '#6b7280'} 
          style={styles.icon}
        />
        <Text style={[
          styles.label,
          active ? styles.activeLabel : styles.inactiveLabel
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }, [isActive, handleNavigation]);

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, 8) }
    ]}>
      <View style={styles.navContainer}>
        {navItems.map(renderNavItem)}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeItem: {
    backgroundColor: '#eff6ff',
  },
  inactiveItem: {
    backgroundColor: 'transparent',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#2563eb',
  },
  inactiveLabel: {
    color: '#6b7280',
  },
});

export default BottomNavigation;