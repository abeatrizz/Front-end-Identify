import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchReports } from '../api';

const ReportListScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data || []);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleItemPress = useCallback((item) => {
    if (item?.id && navigation?.navigate) {
      navigation.navigate('ReportDetail', { reportId: item.id });
    }
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity 
      onPress={() => handleItemPress(item)}
      style={styles.item}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Relatório ${item?.title || 'sem título'}`}
    >
      <Text style={styles.itemText}>{item?.title || 'Título não disponível'}</Text>
    </TouchableOpacity>
  ), [handleItemPress]);

  const keyExtractor = useCallback((item) => item.id, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Carregando relatórios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      
      {reports.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
        </View>
      ) : (
        <FlatList 
          data={reports}
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
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  item: { 
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default ReportListScreen;