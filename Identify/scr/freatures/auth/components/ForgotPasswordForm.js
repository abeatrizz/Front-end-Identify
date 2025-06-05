import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function ForgotPasswordForm({ onSubmit, loading, error, success }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePress = () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setEmailError('Email é obrigatório');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setEmailError('Por favor, insira um email válido');
      return;
    }

    onSubmit(trimmedEmail);
  };

  const isFormValid = email.trim() && validateEmail(email.trim());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.description}>
        Informe seu email cadastrado e enviaremos as instruções para recuperar sua senha.
      </Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {success && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Email enviado com sucesso! Verifique sua caixa de entrada.
          </Text>
        </View>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[
          styles.input,
          emailError && styles.inputError,
          loading && styles.inputDisabled
        ]}
        placeholder="Digite seu email"
        value={email}
        onChangeText={handleEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCorrect={false}
        editable={!loading}
      />
      {emailError && <Text style={styles.fieldError}>{emailError}</Text>}

      <TouchableOpacity 
        style={[
          styles.button,
          (!isFormValid || loading) && styles.buttonDisabled
        ]} 
        onPress={handlePress} 
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Enviar Instruções</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.helpText}>
        Não recebeu o email? Verifique sua pasta de spam ou tente novamente em alguns minutos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123458',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderColor: '#fcc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#eff8ee',
    borderColor: '#c8e6c9',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  fieldError: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#123458',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#888',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
});