import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Erro', 'Por favor, digite um email válido');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Sucesso', `Instruções enviadas para ${email}`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao enviar instruções');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <ForgotPasswordForm onSubmit={handleForgotPassword} loading={loading} />
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
});

export default ForgotPasswordScreen;