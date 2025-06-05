import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title, style, textStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <Text 
        style={[styles.title, textStyle]}
        accessible
        accessibilityRole="header"
        accessibilityLabel={title}
      >
        {title || 'Header'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Header;