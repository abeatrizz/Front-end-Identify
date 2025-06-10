import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';

const CasosScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: casos = [], isLoading, error, refresh } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data-desc');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const filteredAndSortedCasos = casos
    .filter(caso => {
      const matchesSearch = caso.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           caso.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || caso.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'data-asc':
          return new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime();
        case 'data-desc':
          return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
        case 'titulo':
          return (a.titulo || '').localeCompare(b.titulo || '');
        default:
          return 0;
      }
    });

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este caso?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCase(id);
              refresh();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o caso. Tente novamente mais tarde.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em andamento':
        return { bg: '#E3F2FD', text: '#1976D2' };
      case 'Finalizado':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'Arquivado':
        return { bg: '#F5F5F5', text: '#616161' };
      default:
        return { bg: '#FFF3E0', text: '#F57C00' };
    }
  };

  const renderStatusModal = () => (
    <Modal
      visible={showStatusModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowStatusModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Status</Text>
            <TouchableOpacity onPress={() => setShowStatusModal(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={['todos', 'Em andamento', 'Finalizado', 'Arquivado']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setStatusFilter(item);
                  setShowStatusModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  statusFilter === item && styles.modalItemTextSelected
                ]}>
                  {item === 'todos' ? 'Todos' : item}
                </Text>
                {statusFilter === item && (
                  <Feather name="check" size={20} color="#123458" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ordenar por</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={[
              { id: 'data-desc', label: 'Mais recentes' },
              { id: 'data-asc', label: 'Mais antigos' },
              { id: 'titulo', label: 'Por título' }
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSortBy(item.id);
                  setShowSortModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  sortBy === item.id && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
                {sortBy === item.id && (
                  <Feather name="check" size={20} color="#123458" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Casos</Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => navigation.navigate('NewCase')}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.newButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#123458" />
          <Text style={styles.loadingText}>Carregando casos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Casos</Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => navigation.navigate('NewCase')}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.newButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#dc2626" />
          <Text style={styles.errorText}>
            Erro ao carregar casos. Verifique sua conexão e tente novamente.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refresh}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Casos</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('NewCase')}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.newButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#123458']}
            tintColor="#123458"
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <View style={styles.statContent}>
              <View>
                <Text style={[styles.statLabel, { color: '#1976D2' }]}>Em Andamento</Text>
                <Text style={[styles.statValue, { color: '#1976D2' }]}>
                  {casos.filter(c => c.status === 'Em andamento').length}
                </Text>
              </View>
              <Feather name="clock" size={32} color="#1976D2" />
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <View style={styles.statContent}>
              <View>
                <Text style={[styles.statLabel, { color: '#2E7D32' }]}>Finalizados</Text>
                <Text style={[styles.statValue, { color: '#2E7D32' }]}>
                  {casos.filter(c => c.status === 'Finalizado').length}
                </Text>
              </View>
              <Feather name="check-circle" size={32} color="#2E7D32" />
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F5F5F5' }]}>
            <View style={styles.statContent}>
              <View>
                <Text style={[styles.statLabel, { color: '#616161' }]}>Arquivados</Text>
                <Text style={[styles.statValue, { color: '#616161' }]}>
                  {casos.filter(c => c.status === 'Arquivado').length}
                </Text>
              </View>
              <Feather name="archive" size={32} color="#616161" />
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar casos..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#666"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchTerm('')}
              >
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={styles.filterButtonText}>
                {statusFilter === 'todos' ? 'Todos' : statusFilter}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowSortModal(true)}
            >
              <Text style={styles.filterButtonText}>
                {sortBy === 'data-desc' ? 'Mais recentes' : 
                 sortBy === 'data-asc' ? 'Mais antigos' : 'Por título'}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cases List */}
        {filteredAndSortedCasos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum caso encontrado</Text>
            {searchTerm.length > 0 && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchTerm('');
                  setStatusFilter('todos');
                }}
              >
                <Text style={styles.clearFiltersText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredAndSortedCasos.map((caso) => {
            const statusColors = getStatusColor(caso.status);
            return (
              <TouchableOpacity
                key={caso._id}
                style={styles.caseCard}
                onPress={() => navigation.navigate('CaseDetails', { id: caso._id })}
              >
                <View style={styles.caseHeader}>
                  <View style={styles.caseTitleContainer}>
                    <Text style={styles.caseTitle}>
                      {caso.titulo || 'Título não informado'}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {caso.status}
                      </Text>
                    </View>
                  </View>
                  {user?.tipoUsuario === 'admin' && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(caso._id)}
                    >
                      <Feather name="trash-2" size={20} color="#dc2626" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.caseDescription} numberOfLines={2}>
                  {caso.descricao || 'Sem descrição'}
                </Text>
                <View style={styles.caseFooter}>
                  <View style={styles.caseInfo}>
                    <Feather name="calendar" size={14} color="#666" />
                    <Text style={styles.caseDate}>
                      Criado em {formatDate(caso.dataCriacao)}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {renderStatusModal()}
      {renderSortModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123458',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#123458',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  newButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#123458',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#123458',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
  caseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caseDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#123458',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123458',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalItemText: {
    fontSize: 16,
    color: '#666',
  },
  modalItemTextSelected: {
    color: '#123458',
    fontWeight: '600',
  },
});

export default CasosScreen; 