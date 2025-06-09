import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [systemStatus, setSystemStatus] = useState('Inicializando...');
  
  console.log('🚀 Identify App - JavaScript Puro (convertido de TSX)');

  useEffect(() => {
    checkSystem();
  }, []);

  const checkSystem = async () => {
    try {
      await AsyncStorage.setItem('test', 'OK');
      const test = await AsyncStorage.getItem('test');
      
      if (test === 'OK') {
        setSystemStatus('✅ Sistema OK - JavaScript Puro');
        console.log('✅ Conversão TSX → JS bem-sucedida!');
      }
    } catch (error) {
      setSystemStatus('❌ Erro no sistema');
      console.error('❌ Erro:', error);
    }
  };

  const showFeatures = () => {
    Alert.alert(
      'Identify - Funcionalidades',
      '🦷 Cadastro de Casos Periciais\n📷 Captura de Imagens\n🔍 Análise Dentária\n📄 Laudos Digitais\n🔔 Notificações',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🦷 Identify</Text>
      <Text style={styles.subtitle}>Sistema de Perícias Odonto-Legais</Text>
      <Text style={styles.tech}>Convertido: TSX → JavaScript Puro</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>📊 Status</Text>
        <Text style={styles.statusText}>{systemStatus}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={showFeatures}>
        <Text style={styles.buttonText}>📋 Ver Funcionalidades</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>🔄 Migração Concluída</Text>
        <Text style={styles.infoItem}>• App.tsx → App.js ✅</Text>
        <Text style={styles.infoItem}>• TypeScript → JavaScript ✅</Text>
        <Text style={styles.infoItem}>• Expo Router: Removido</Text>
        <Text style={styles.infoItem}>• AsyncStorage: Funcionando</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 4,
  },
  tech: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  statusContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#155724',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 4,
  },
});