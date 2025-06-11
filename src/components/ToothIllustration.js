import React, { memo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ToothIllustration = memo(({ 
  toothNumber, 
  hasEvidence = false, 
  onPress,
  size = 'md'
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 40 };
      case 'md': return { width: 40, height: 48 };
      case 'lg': return { width: 48, height: 56 };
      default: return { width: 40, height: 48 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 10;
      case 'md': return 12;
      case 'lg': return 14;
      default: return 12;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        getSizeStyle(),
        hasEvidence && styles.hasEvidence
      ]}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 24 30"
        fill="none"
      >
        <Path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
          fill={hasEvidence ? "#2563EB" : "#E5E7EB"}
          stroke={hasEvidence ? "#1D4ED8" : "#D1D5DB"}
          strokeWidth="1"
        />
      </Svg>
      <Text
        style={[
          styles.toothNumber,
          { fontSize: getTextSize() },
          hasEvidence && styles.toothNumberActive
        ]}
      >
        {toothNumber}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hasEvidence: {
    transform: [{ scale: 1.05 }],
  },
  toothNumber: {
    position: 'absolute',
    color: '#6B7280',
    fontWeight: '500',
  },
  toothNumberActive: {
    color: '#FFFFFF',
  },
});

export default ToothIllustration;