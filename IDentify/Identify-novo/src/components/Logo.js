import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = memo(({ 
  size = 'medium', 
  variant = 'dark',
  style = {}
}) => {
  const getImageSize = () => {
    switch (size) {
      case 'small': return { height: 24, width: 'auto' };
      case 'medium': return { height: 32, width: 'auto' };
      case 'large': return { height: 48, width: 'auto' };
      default: return { height: 32, width: 'auto' };
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../assets/Logo.ID.png')}
        style={[styles.image, getImageSize()]}
        resizeMode="contain"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 1,
  },
});

export default Logo;