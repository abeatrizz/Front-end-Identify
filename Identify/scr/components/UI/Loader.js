import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Loader = ({ size = 'large', color = '#1e90ff', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator 
        size={size} 
        color={color}
        accessible
        accessibilityLabel="Carregando"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;