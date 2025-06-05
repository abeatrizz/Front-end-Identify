import React, { memo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import CaseListScreen from '../features/cases/screens/CaseListScreen';
import CaseDetailScreen from '../features/cases/screens/CaseDetailScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = memo(({ isAuthenticated = false }) => {
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator
          initialRouteName="Cases"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e90ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="Cases" 
            component={CaseListScreen}
            options={{
              title: 'Casos',
            }}
          />
          <Stack.Screen 
            name="CaseDetail" 
            component={CaseDetailScreen}
            options={{
              title: 'Detalhes do Caso',
            }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
});

RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;