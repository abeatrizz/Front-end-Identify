import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import LoginForm from '../components/LoginForm';
import { loginApi } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await loginApi(email, password);
      
      if (response.success) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.replace('Home') }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro durante o login');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Identify</Text>
      <LoginForm onSubmit={handleLogin} loading={loading} />
      <TouchableOpacity 
        onPress={handleForgotPassword}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Esqueceu a senha"
      >
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#123458',
  },
  forgotText: {
    marginTop: 20,
    color: '#123458',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default LoginScreen;