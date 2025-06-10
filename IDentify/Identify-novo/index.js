import { registerRootComponent } from 'expo';
import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import App from './App';

const AppWithProviders = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWithProviders);
