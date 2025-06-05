import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const UploadEvidenceScreen = () => {
  const handleUpload = useCallback(() => {
    Alert.alert('Sucesso', 'Evidência enviada!');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload de Evidência</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUpload}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Enviar evidência"
      >
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#123458',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadEvidenceScreen;