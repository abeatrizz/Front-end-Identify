import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

const API_BASE_URL = 'https://api.seuapp.com';

export default function ForgotPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (email) => {
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        Alert.alert(
          'Email Enviado',
          `Instruções para redefinir sua senha foram enviadas para ${email}. Verifique sua caixa de entrada e spam.`,
          [
            {
              text: 'Voltar ao Login',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        const errorMessage = data.message || 'Email não encontrado em nosso sistema';
        Alert.alert('Erro', errorMessage);
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        Alert.alert('Erro', 'Problema de conexão com o servidor');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleResendEmail = () => {
    setEmailSent(false);
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Ionicons name="mail-outline" size={80} color="#28a745" />
          <Text style={styles.successTitle}>Email Enviado!</Text>
          <Text style={styles.successMessage}>
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </Text>
          <Text style={styles.successSubMessage}>
            Não recebeu o email? Verifique sua pasta de spam.
          </Text>
          
          <TouchableOpacity style={styles.resendButton} onPress={handleResendEmail}>
            <Text style={styles.resendButtonText}>Enviar Novamente</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#123458" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="lock-closed-outline" size={60} color="#123458" />
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Digite seu email para receber instruções de redefinição de senha
        </Text>
      </View>

      <View style={styles.formContainer}>
        <ForgotPasswordForm 
          onSubmit={handleForgotPassword} 
          loading={loading} 
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Lembrou da senha? {' '}
          <Text style={styles.loginLink} onPress={handleGoBack}>
            Fazer Login
          </Text>
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#123458" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  backIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#123458',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 0.3,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  footer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  loginLink: {
    color: '#123458',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28a745',
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  successSubMessage: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 30,
  },
  resendButton: {
    backgroundColor: '#123458',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 16,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#123458',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});