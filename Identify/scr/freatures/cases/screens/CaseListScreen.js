import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import CaseCard from '../components/CaseCard';
import { fetchCases } from '../services/api';

const mockCases = [
  { id: '1', title: 'Caso 1', status: 'Aberto', date: '2025-06-05' },
  { id: '2', title: 'Caso 2', status: 'Em andamento', date: '2025-06-04' },
];

const CaseListScreen = ({ navigation }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCases = useCallback(async () => {
    try {
      setLoading(true);
      const casesData = await fetchCases();
      setCases(casesData);
    } catch (error) {
      console.error('Erro ao carregar casos:', error);
      setCases(mockCases);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const handleCasePress = useCallback((caseItem) => {
    if (caseItem?.id) {
      navigation.navigate('CaseDetail', { caseId: caseItem.id });
    }
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <CaseCard caseItem={item} onPress={handleCasePress} />
  ), [handleCasePress]);

  const keyExtractor = useCallback((item) => item.id, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Carregando casos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cases.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nenhum caso encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={cases}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
});

export default CaseListScreen;
