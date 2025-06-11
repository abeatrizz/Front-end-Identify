import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Importar telas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CasosScreen from '../screens/CasosScreen';
import CaseDetailsScreen from '../screens/CaseDetailsScreen';
import NewCaseScreen from '../screens/NewCaseScreen';
import VitimasScreen from '../screens/VitimasScreen';
import EvidenceScreen from '../screens/EvidenceScreen';
import EvidenceDetailScreen from '../screens/EvidenceDetailScreen';
import LaudosScreen from '../screens/LaudosScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade'
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Dashboard"
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="Casos" 
        component={CasosScreen}
        options={{ title: 'Casos' }}
      />
      <Stack.Screen 
        name="CaseDetails" 
        component={CaseDetailsScreen}
        options={{ title: 'Detalhes do Caso' }}
      />
      <Stack.Screen 
        name="NewCase" 
        component={NewCaseScreen}
        options={{ title: 'Novo Caso' }}
      />
      <Stack.Screen 
        name="Vitimas" 
        component={VitimasScreen}
        options={{ title: 'Vítimas' }}
      />
      <Stack.Screen 
        name="Evidence" 
        component={EvidenceScreen}
        options={{ title: 'Evidências' }}
      />
      <Stack.Screen 
        name="EvidenceDetail" 
        component={EvidenceDetailScreen}
        options={{ title: 'Detalhes da Evidência' }}
      />
      <Stack.Screen 
        name="Laudos" 
        component={LaudosScreen}
        options={{ title: 'Laudos' }}
      />
      <Stack.Screen 
        name="Relatorios" 
        component={RelatoriosScreen}
        options={{ title: 'Relatórios' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen 
        name="AdminUsers" 
        component={AdminUsersScreen}
        options={{ title: 'Administrar Usuários' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f0',
  },
});