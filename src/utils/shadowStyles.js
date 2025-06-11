import { Platform } from 'react-native';

export const getShadowStyle = (elevation = 4) => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: elevation / 2,
    },
    android: {
      elevation,
    },
    web: {
      boxShadow: `0px ${elevation/2}px ${elevation}px rgba(0,0,0,0.1)`,
    },
  });
}; 