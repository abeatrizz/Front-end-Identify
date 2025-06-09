import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';

// Importar componentes migrados conforme formos criando
// import LoginForm from './src/features/auth/components/LoginForm';
// import Button from './src/components/UI/Button';

export default function App() {
  const [currentTest, setCurrentTest] = useState('inicio');
  
  console.log('🔄 App de teste para migração');

  const testComponents = [
    { id: 'inicio', name: '🏠 Início', component: 'TelaInicial' },
    { id: 'button', name: '🔘 Button UI', component: 'TestButton' },
    { id: 'input', name: '📝 Input UI', component: 'TestInput' },
    { id: 'loginform', name: '🔐 LoginForm', component: 'TestLoginForm' },
    { id: 'storage', name: '💾 Storage', component: 'TestStorage' },
    { id: 'api', name: '🌐 API', component: 'TestAPI' },
  ];

  const renderCurrentTest = () => {
    switch(currentTest) {
      case 'inicio':
        return (
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>🔄 Migração React → React Native</Text>
            <Text style={styles.subtitle}>Sistema Identify</Text>
            <Text style={styles.description}>
              Selecione um componente abaixo para testar a migração individual
            </Text>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>📊 Status da Migração</Text>
              <Text style={styles.statusItem}>• Estrutura copiada: ⏳ Em andamento</Text>
              <Text style={styles.statusItem}>• Components UI: ⏳ Aguardando</Text>
              <Text style={styles.statusItem}>• Forms: ⏳ Aguardando</Text>
              <Text style={styles.statusItem}>• Screens: ⏳ Aguardando</Text>
              <Text style={styles.statusItem}>• Navigation: ⏳ Aguardando</Text>
            </View>
          </View>
        );
        
      case 'button':
        return (
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🔘 Teste do Button UI</Text>
            <Text style={styles.testDescription}>
              Componente Button migrado do React para React Native
            </Text>
            {/* Aqui vamos importar e testar o Button migrado */}
            <TouchableOpacity style={styles.placeholderButton}>
              <Text style={styles.placeholderButtonText}>Button Placeholder</Text>
            </TouchableOpacity>
            <Text style={styles.testStatus}>Status: ⏳ Aguardando migração</Text>
          </View>
        );
        
      case 'loginform':
        return (
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🔐 Teste do LoginForm</Text>
            <Text style={styles.testDescription}>
              LoginForm migrado do React para React Native
            </Text>
            {/* Aqui vamos importar e testar o LoginForm migrado */}
            <View style={styles.placeholder}>
              <Text>LoginForm será carregado aqui</Text>
            </View>
            <Text style={styles.testStatus}>Status: ⏳ Aguardando migração</Text>
          </View>
        );
        
      default:
        return (
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🔧 Em Desenvolvimento</Text>
            <Text style={styles.testDescription}>
              Este teste será implementado conforme migramos os componentes
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderCurrentTest()}
      </ScrollView>
      
      <View style={styles.bottomNavigation}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {testComponents.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[
                styles.navButton,
                currentTest === test.id && styles.navButtonActive
              ]}
              onPress={() => setCurrentTest(test.id)}
            >
              <Text style={[
                styles.navButtonText,
                currentTest === test.id && styles.navButtonTextActive
              ]}>
                {test.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  statusContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#1E90FF',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 10,
  },
  statusItem: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
  testContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  testTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 16,
  },
  testDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 30,
  },
  testStatus: {
    fontSize: 12,
    color: '#ff9500',
    marginTop: 20,
    fontWeight: '500',
  },
  placeholder: {
    backgroundColor: '#f8f9fa',
    padding: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  placeholderButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  placeholderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomNavigation: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  navButtonActive: {
    backgroundColor: '#1E90FF',
  },
  navButtonText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  navButtonTextActive: {
    color: '#fff',
  },
});