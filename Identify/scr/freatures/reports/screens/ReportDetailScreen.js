import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchReportById } from '../api';

const ReportDetailScreen = ({ route }) => {
  const reportId = route?.params?.reportId;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReport = useCallback(async () => {
    if (!reportId) {
      setError('ID do relatório não encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchReportById(reportId);
      setReport(data);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
      setError(err.message || 'Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Relatório não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title || 'Título não disponível'}</Text>
      <Text style={styles.content}>
        {report.content || 'Conteúdo não disponível'}
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
    fontSize: 24, 
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
});

export default ReportDetailScreen;