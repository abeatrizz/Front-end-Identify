import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CaseDetailScreen = ({ route, navigation }) => {
  const caseId = route?.params?.caseId;

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!caseId) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>ID do caso não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Caso</Text>
      <Text style={styles.info}>ID do Caso: {caseId}</Text>
      <Text style={styles.description}>
        Aqui você pode mostrar informações detalhadas do caso.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
});

export default CaseDetailScreen;