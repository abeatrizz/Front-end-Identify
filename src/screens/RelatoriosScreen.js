import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, BarChart3, Download, Calendar, FileText } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useRelatorios, useCreateRelatorio } from '../hooks/useApiRelatorios';
import { useCasos } from '../hooks/useApiCasos';
import StandardHeader from '../components/StandardHeader';
import { useAuth } from '../hooks/useAuth';

const RelatoriosScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');
  const [selectedCase, setSelectedCase] = useState(null);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);

  const { data: relatorios = [], isLoading, refetch } = useRelatorios();
  const { data: casos = [] } = useCasos();
  const createRelatorio = useCreateRelatorio();

  const [refreshing, setRefreshing] = useState(false);

  const onSubmit = async () => {
    try {
      const relatorioData = {
        tipo: tipoRelatorio,
        geradoPor: user?.nome || 'Desconhecido',
        dataCriacao: new Date().toISOString(),
        casoId: tipoRelatorio === 'caso' ? selectedCase : undefined,
        dataInicio: tipoRelatorio === 'periodo' ? dataInicio.toISOString() : undefined,
        dataFim: tipoRelatorio === 'periodo' ? dataFim.toISOString() : undefined,
      };

      if (tipoRelatorio === 'caso' && !selectedCase) {
        Alert.alert('Erro', 'Selecione um caso para o relatório de caso.');
        return;
      }
      if (tipoRelatorio === 'periodo' && (!dataInicio || !dataFim)) {
        Alert.alert('Erro', 'Selecione as datas de início e fim para o relatório por período.');
        return;
      }

      await createRelatorio.mutateAsync(relatorioData);
      setIsModalOpen(false);
      setTipoRelatorio('geral');
      setSelectedCase(null);
      setDataInicio(new Date());
      setDataFim(new Date());
      refetch();
      Alert.alert('Sucesso', 'Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Error creating relatorio:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao gerar o relatório.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'geral':
        return 'Relatório Geral';
      case 'caso':
        return 'Relatório de Caso';
      case 'periodo':
        return 'Relatório por Período';
      default:
        return tipo;
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const onChangeDateInicio = (event, selectedDate) => {
    const currentDate = selectedDate || dataInicio;
    setShowDatePickerInicio(Platform.OS === 'ios');
    setDataInicio(currentDate);
  };

  const onChangeDateFim = (event, selectedDate) => {
    const currentDate = selectedDate || dataFim;
    setShowDatePickerFim(Platform.OS === 'ios');
    setDataFim(currentDate);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StandardHeader title="Relatórios" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando relatórios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StandardHeader 
        title="Relatórios" 
        rightElement={
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              setTipoRelatorio('geral');
              setSelectedCase(null);
              setDataInicio(new Date());
              setDataFim(new Date());
              setIsModalOpen(true);
            }}
          >
            <Feather name="plus" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Gerar</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cards de Tipos de Relatório */}
        <View style={styles.reportTypesContainer}>
          <View style={styles.reportTypeCard}>
            <View style={styles.reportTypeContent}>
              <View>
                <Text style={styles.reportTypeTitle}>Relatórios Gerais</Text>
                <Text style={styles.reportTypeDescription}>Visão geral do sistema</Text>
              </View>
              <BarChart3 name="bar-chart" size={32} color="#2563eb" />
            </View>
          </View>

          <View style={styles.reportTypeCardGreen}>
            <View style={styles.reportTypeContent}>
              <View>
                <Text style={styles.reportTypeTitleGreen}>Relatórios de Casos</Text>
                <Text style={styles.reportTypeDescriptionGreen}>Detalhes específicos por caso</Text>
              </View>
              <FileText name="file-text" size={32} color="#16a34a" />
            </View>
          </View>

          <View style={styles.reportTypeCardPurple}>
            <View style={styles.reportTypeContent}>
              <View>
                <Text style={styles.reportTypeTitlePurple}>Relatórios Temporais</Text>
                <Text style={styles.reportTypeDescriptionPurple}>Análise por período</Text>
              </View>
              <Calendar name="calendar" size={32} color="#9333ea" />
            </View>
          </View>
        </View>

        {/* Lista de Relatórios */}
        <View style={styles.generatedReportsCard}>
          <Text style={styles.generatedReportsTitle}>Relatórios Gerados</Text>
          <View style={styles.generatedReportsContent}>
              {relatorios.length === 0 ? (
              <View style={styles.emptyReportsContainer}>
                <BarChart3 name="bar-chart" size={48} color="#ccc" style={styles.emptyReportsIcon} />
                <Text style={styles.emptyReportsText}>Nenhum relatório gerado ainda</Text>
              </View>
            ) : (
              <FlatList
                data={relatorios}
                keyExtractor={(item) => item._id}
                renderItem={({ item: relatorio }) => (
                  <View
                    style={styles.reportItem}
                  >
                    <View style={styles.reportItemContent}>
                      <View style={styles.reportItemHeader}>
                        <BarChart3 name="bar-chart" size={16} color="#2563eb" />
                        <Text style={styles.reportItemTitle}>
                          {getTipoLabel(relatorio.tipo)} #{relatorio._id.slice(-6)}
                        </Text>
                      </View>
                      <Text style={styles.reportItemMeta}>
                        📅 Gerado em: {formatDate(relatorio.dataCriacao)}
                      </Text>
                      <Text style={styles.reportItemMeta}>
                        👤 Por: {relatorio.geradoPor}
                      </Text>
                    </View>

                    <View style={styles.reportItemActions}>
                      <TouchableOpacity onPress={() => { /* Implementar download */ }} style={styles.downloadButton}>
                        <Download name="download" size={16} color="#333" />
                        <Text style={styles.downloadButtonText}>Download</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Gerar Relatório */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gerar Novo Relatório</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tipo de Relatório</Text>
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={tipoRelatorio}
                    onValueChange={(itemValue) => setTipoRelatorio(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Relatório Geral" value="geral" />
                    <Picker.Item label="Relatório de Caso Específico" value="caso" />
                    <Picker.Item label="Relatório por Período" value="periodo" />
                  </Picker>
                </View>
                {/* {errors.tipo && <Text style={styles.errorText}>{errors.tipo.message}</Text>} */}
              </View>

              {tipoRelatorio === 'caso' && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Caso</Text>
                  <View style={styles.selectContainer}>
                    <Picker
                      selectedValue={selectedCase}
                      onValueChange={(itemValue) => setSelectedCase(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecione um caso" value={null} />
                      {casos.map((caso) => (
                        <Picker.Item key={caso._id} label={caso.titulo} value={caso._id} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              {tipoRelatorio === 'periodo' && (
                <View style={styles.dateRangeContainer}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.formLabel}>Data Início</Text>
                    <TouchableOpacity onPress={() => setShowDatePickerInicio(true)} style={styles.datePickerButton}>
                      <Text>{formatDate(dataInicio.toISOString())}</Text>
                      <Calendar name="calendar" size={20} color="#555" />
                    </TouchableOpacity>
                    {showDatePickerInicio && (
                      <DateTimePicker
                        value={dataInicio}
                        mode="date"
                        display="default"
                        onChange={onChangeDateInicio}
                      />
                    )}
                  </View>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.formLabel}>Data Fim</Text>
                    <TouchableOpacity onPress={() => setShowDatePickerFim(true)} style={styles.datePickerButton}>
                      <Text>{formatDate(dataFim.toISOString())}</Text>
                      <Calendar name="calendar" size={20} color="#555" />
                    </TouchableOpacity>
                    {showDatePickerFim && (
                      <DateTimePicker
                        value={dataFim}
                        mode="date"
                        display="default"
                        onChange={onChangeDateFim}
                      />
                    )}
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={onSubmit}
                  disabled={createRelatorio.isPending}
                >
                  <Text style={styles.submitButtonText}>
                    {createRelatorio.isPending ? 'Gerando...' : 'Gerar Relatório'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsModalOpen(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewPadding: {
    padding: 16,
    paddingBottom: 96, // Espaço para o final da rolagem
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  reportTypesContainer: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  reportTypeCard: {
    backgroundColor: '#e0f2fe',
    borderColor: '#90cdf4',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTypeCardGreen: {
    backgroundColor: '#e6ffed',
    borderColor: '#9ae6b4',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTypeCardPurple: {
    backgroundColor: '#f3e8ff',
    borderColor: '#d6bcfa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTypeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTypeTitle: {
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
    fontSize: 16,
  },
  reportTypeDescription: {
    color: '#3b82f6',
    fontSize: 13,
  },
  reportTypeTitleGreen: {
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 4,
    fontSize: 16,
  },
  reportTypeDescriptionGreen: {
    color: '#10b981',
    fontSize: 13,
  },
  reportTypeTitlePurple: {
    fontWeight: 'bold',
    color: '#5a3294',
    marginBottom: 4,
    fontSize: 16,
  },
  reportTypeDescriptionPurple: {
    color: '#8b5cf6',
    fontSize: 13,
  },
  generatedReportsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  generatedReportsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  generatedReportsContent: {
    padding: 16,
  },
  emptyReportsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyReportsIcon: {
    marginBottom: 8,
  },
  emptyReportsText: {
    color: '#555',
    fontSize: 16,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  reportItemContent: {
    flex: 1,
  },
  reportItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reportItemTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    fontSize: 15,
  },
  reportItemMeta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  reportItemActions: {
    marginLeft: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  downloadButtonText: {
    marginLeft: 4,
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScrollView: {
    flexGrow: 1,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 5,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateInputGroup: {
    flex: 1,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RelatoriosScreen;
