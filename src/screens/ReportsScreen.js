import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FileText, Download, Eye, Search, Filter, Calendar, X, Mic, Play } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const ReportsScreen = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data dos relatórios
  const reports = [
    {
      id: '1',
      caseNumber: '#6831121',
      title: 'Laudo Pericial - Análise Dental',
      patient: 'João da Silva',
      perito: 'Dr. João Silva',
      status: 'Concluído',
      date: '2024-01-15',
      type: 'Laudo Completo',
      confidence: 95
    },
    {
      id: '2',
      caseNumber: '#6831122',
      title: 'Relatório Preliminar',
      patient: 'Maria Santos',
      perito: 'Dr. João Silva',
      status: 'Em andamento',
      date: '2024-01-14',
      type: 'Relatório Parcial',
      confidence: 78
    },
    {
      id: '3',
      caseNumber: '#6831120',
      title: 'Análise Comparativa',
      patient: 'Pedro Oliveira',
      perito: 'Dr. João Silva',
      status: 'Arquivado',
      date: '2024-01-10',
      type: 'Análise IA',
      confidence: 89
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído': return styles.badgeGreen;
      case 'Em andamento': return styles.badgeBlue;
      case 'Arquivado': return styles.badgeGray;
      default: return styles.badgeGray;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Laudo Completo': return styles.badgeTypeGray;
      case 'Relatório Parcial': return styles.badgeTypeGray;
      case 'Análise IA': return styles.badgeTypeGray;
      default: return styles.badgeTypeGray;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const ReportPreview = ({ report }) => (
    <ScrollView style={styles.modalBody}>
      {/* Cabeçalho do relatório */}
      <View style={styles.previewHeader}>
        <Text style={styles.previewTitle}>{report.title}</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, getStatusColor(report.status)]}>
            <Text style={styles.badgeText}>{report.status}</Text>
          </View>
          <View style={[styles.badge, getTypeColor(report.type)]}>
            <Text style={styles.badgeText}>{report.type}</Text>
          </View>
        </View>
      </View>

      {/* Informações do caso */}
      <View style={styles.infoGrid}>
        <View>
          <Text style={styles.infoLabel}>Caso:</Text>
          <Text style={styles.infoText}>{report.caseNumber}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>Paciente:</Text>
          <Text style={styles.infoText}>{report.patient}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>Perito:</Text>
          <Text style={styles.infoText}>{report.perito}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>Data:</Text>
          <Text style={styles.infoText}>{report.date}</Text>
        </View>
      </View>

      {/* Confiança da IA */}
      {report.confidence && (
        <View style={styles.confidenceCard}>
          <Text style={styles.infoLabel}>Confiança da Análise:</Text>
          <View style={styles.confidenceBarContainer}>
            <View style={styles.confidenceBarBackground}>
              <View
                style={[
                  styles.confidenceBarFill,
                  { width: `${report.confidence}%` },
                  report.confidence >= 90 ? styles.confidenceGreen :
                  report.confidence >= 75 ? styles.confidenceYellow : styles.confidenceRed
                ]}
              ></View>
            </View>
            <Text style={styles.confidenceText}>{report.confidence}%</Text>
          </View>
        </View>
      )}

      {/* Conteúdo simulado do relatório */}
      <View style={styles.contentSection}>
        <View>
          <Text style={styles.sectionTitle}>Resumo Executivo</Text>
          <Text style={styles.sectionText}>
            Este laudo apresenta a análise pericial odontológica realizada para identificação 
            através de registros dentários. A análise foi conduzida utilizando técnicas 
            tradicionais combinadas com inteligência artificial para maior precisão.
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Metodologia</Text>
          <Text style={styles.sectionText}>
            Foi realizada comparação entre registros ante-mortem e post-mortem, 
            incluindo análise de restaurações, anatomia dental e características específicas.
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Conclusão</Text>
          <Text style={styles.sectionText}>
            Com base na análise realizada, foi possível estabelecer {report.confidence >= 90 ? 'identificação positiva' : 'similaridades significativas'} 
            entre os registros comparados.
          </Text>
        </View>

        {/* Notas de áudio simuladas com cores neutras */}
        <View style={styles.audioNotesCard}>
          <Text style={styles.audioNotesTitle}>
            <Mic name="mic" size={16} color="#444" />
            <Text style={{ marginLeft: 8 }}>Notas de Áudio</Text>
          </Text>
          <View style={styles.audioNotesList}>
            <View style={styles.audioNoteItem}>
              <Text style={styles.audioNoteText}>Observações iniciais - 2:15</Text>
              <TouchableOpacity style={styles.audioNoteButton}>
                <Play name="play" size={12} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.audioNoteItem}>
              <Text style={styles.audioNoteText}>Conclusões finais - 1:45</Text>
              <TouchableOpacity style={styles.audioNoteButton}>
                <Play name="play" size={12} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com cores originais */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FileText name="file-text" size={28} color="white" />
          <View>
            <Text style={styles.headerTitle}>Relatórios e Laudos</Text>
            <Text style={styles.headerSubtitle}>Consulte e baixe seus relatórios</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer} 
        contentContainerStyle={styles.contentPadding}
      >
        {/* Filtros com cores neutras */}
        <View style={styles.filterCard}>
          <View style={styles.filterContent}>
            <View style={styles.searchContainer}>
              <Search name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.searchInput}
              />
            </View>
            
            <View style={styles.filterGroup}>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={statusFilter}
                  onValueChange={(itemValue) => setStatusFilter(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Todos os Status" value="all" />
                  <Picker.Item label="Concluído" value="Concluído" />
                  <Picker.Item label="Em andamento" value="Em andamento" />
                  <Picker.Item label="Arquivado" value="Arquivado" />
                </Picker>
                <Feather name="filter" size={16} color="#555" style={styles.pickerIcon} />
              </View>

              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={dateFilter}
                  onValueChange={(itemValue) => setDateFilter(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Todo período" value="all" />
                  <Picker.Item label="Hoje" value="today" />
                  <Picker.Item label="Esta semana" value="week" />
                  <Picker.Item label="Este mês" value="month" />
                </Picker>
                <Feather name="calendar" size={16} color="#555" style={styles.pickerIcon} />
              </View>
            </View>
          </View>
        </View>

        {/* Lista de Relatórios */}
        <View style={styles.reportsList}>
          {filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => {
                setSelectedReport(report);
                setIsModalVisible(true);
              }}
            >
              <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, getStatusColor(report.status)]}>
                    <Text style={styles.badgeText}>{report.status}</Text>
                  </View>
                  <View style={[styles.badge, getTypeColor(report.type)]}>
                    <Text style={styles.badgeText}>{report.type}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.reportInfo}>
                <Text style={styles.reportCase}>Caso: {report.caseNumber}</Text>
                <Text style={styles.reportPatient}>Paciente: {report.patient}</Text>
                <Text style={styles.reportDate}>Data: {report.date}</Text>
              </View>

              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Eye name="eye" size={16} color="#2563eb" />
                  <Text style={styles.actionButtonText}>Visualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Download name="download" size={16} color="#16a34a" />
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Preview */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Visualização do Relatório</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <X name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {selectedReport && <ReportPreview report={selectedReport} />}
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
  header: {
    backgroundColor: '#333',
    padding: 16,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 96,
  },
  filterCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  filterContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  selectContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    height: 48,
    justifyContent: 'center',
    position: 'relative',
  },
  picker: {
    height: 48,
    width: '100%',
    color: '#333',
  },
  pickerIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    zIndex: 1,
  },
  reportsList: {
    flexGrow: 1,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  reportInfo: {
    marginBottom: 12,
  },
  reportCase: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  reportPatient: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '95%',
    maxHeight: '90%',
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
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flexGrow: 1,
  },
  previewHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
    fontSize: 14,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
  },
  confidenceCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  confidenceBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  confidenceBarBackground: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    height: 8,
    marginRight: 10,
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  confidenceGreen: {
    backgroundColor: '#28a745',
  },
  confidenceYellow: {
    backgroundColor: '#ffc107',
  },
  confidenceRed: {
    backgroundColor: '#dc3545',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontSize: 16,
  },
  sectionText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  audioNotesCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
  },
  audioNotesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  audioNotesList: {
    gap: 10,
  },
  audioNoteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  audioNoteText: {
    fontSize: 14,
    color: '#555',
  },
  audioNoteButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
  },
});

export default ReportsScreen;
