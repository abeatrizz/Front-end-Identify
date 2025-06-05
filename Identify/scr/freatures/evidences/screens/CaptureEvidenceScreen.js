import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CaptureEvidenceScreen = ({ navigation }) => {
  const handleNavigateToUpload = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate('UploadEvidence');
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capturar Evidência</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleNavigateToUpload}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Ir para tela de upload de evidência"
      >
        <Text style={styles.buttonText}>Ir para Upload</Text>
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

export default CaptureEvidenceScreen;