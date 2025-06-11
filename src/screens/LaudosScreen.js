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
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FileText, Edit, Trash2, Search, Download } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { useLaudos, useCreateLaudo, useUpdateLaudo, useDeleteLaudo } from '../hooks/useApiLaudos';
import { useCasos } from '../hooks/useApiCasos';
import StandardHeader from '../components/StandardHeader';
import { useAuth } from '../hooks/useAuth';

const LaudosScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaudo, setEditingLaudo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);

  const { data: laudos = [], isLoading, refetch } = useLaudos();
  const { data: casos = [] } = useCasos();
  const createLaudo = useCreateLaudo();
  const updateLaudo = useUpdateLaudo();
  const deleteLaudo = useDeleteLaudo();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (editingLaudo) {
      setSelectedCase(editingLaudo.casoId);
    } else {
      setSelectedCase(null);
    }
  }, [editingLaudo]);

  const filteredLaudos = laudos.filter(laudo =>
    laudo.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laudo.conclusoes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async () => {
    try {
      const laudoData = {
        casoId: selectedCase,
        descricao: editingLaudo?.descricao || '',
        conclusoes: editingLaudo?.conclusoes || '',
        perito: editingLaudo?.perito || user?.nome || '',
        observacoes: editingLaudo?.observacoes || ''
      };

      if (!laudoData.casoId || !laudoData.descricao || !laudoData.conclusoes || !laudoData.perito) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }

      if (editingLaudo) {
        await updateLaudo.mutateAsync({ id: editingLaudo._id, data: laudoData });
      } else {
        await createLaudo.mutateAsync(laudoData);
      }

      setIsModalOpen(false);
      setEditingLaudo(null);
      setSelectedCase(null);
      refetch();
      Alert.alert('Sucesso', `Laudo ${editingLaudo ? 'atualizado' : 'criado'} com sucesso!`);
    } catch (error) {
      console.error('Error saving laudo:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o laudo.');
    }
  };

  const handleEdit = (laudo) => {
    setEditingLaudo(laudo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este laudo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
      try {
        await deleteLaudo.mutateAsync(id);
              refetch();
              Alert.alert('Sucesso', 'Laudo excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting laudo:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o laudo.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StandardHeader title="Laudos" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando laudos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StandardHeader 
        title="Laudos" 
        rightElement={
          user?.tipoUsuario === 'perito' || user?.tipoUsuario === 'admin' ? (
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => {
                setEditingLaudo(null);
                setIsModalOpen(true);
              }}
            >
              <Feather name="plus" size={16} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Novo</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Busca */}
        <View style={styles.searchCard}>
          <View style={styles.searchInputContainer}>
            <Search name="search" size={16} color="gray" style={styles.searchIcon} />
            <TextInput
                placeholder="Buscar laudos..."
                value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
              />
          </View>
        </View>

        {/* Lista de Laudos */}
        <View style={styles.laudosListContainer}>
          {filteredLaudos.length === 0 ? (
            <View style={styles.emptyCard}>
              <FileText name="file-text" size={48} color="#ccc" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Nenhum laudo encontrado</Text>
            </View>
          ) : (
            filteredLaudos.map((laudo) => (
              <View key={laudo._id} style={styles.laudoCard}>
                <View style={styles.laudoHeader}>
                  <View style={styles.laudoTitleContainer}>
                    <FileText name="file-text" size={20} color="#2563eb" />
                    <Text style={styles.laudoTitle}>
                          Laudo #{laudo._id.slice(-6)}
                    </Text>
                  </View>
                  <Text style={styles.laudoMeta}>
                        👨‍⚕️ Perito: {laudo.perito}
                  </Text>
                  <Text style={styles.laudoMeta}>
                        📅 Criado em: {formatDate(laudo.dataCriacao)}
                  </Text>
                </View>

                <View style={styles.laudoActions}>
                  {(user?.tipoUsuario === 'perito' || user?.tipoUsuario === 'admin') && (
                    <TouchableOpacity onPress={() => handleEdit(laudo)} style={styles.actionButton}>
                      <Edit name="edit" size={16} color="#2563eb" />
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>
                  )}
                  {(user?.tipoUsuario === 'perito' || user?.tipoUsuario === 'admin') && (
                    <TouchableOpacity onPress={() => handleDelete(laudo._id)} style={styles.actionButton}>
                      <Trash2 name="trash-2" size={16} color="#dc2626" />
                      <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => { /* Implementar download */ }} style={styles.actionButton}>
                    <Download name="download" size={16} color="#16a34a" />
                    <Text style={styles.actionButtonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('CaseDetails', { id: laudo.casoId })} 
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Ver Detalhes do Caso</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.laudoDescriptionContainer}>
                  <Text style={styles.laudoDescriptionLabel}>Descrição:</Text>
                  <Text style={styles.laudoDescriptionText}>{laudo.descricao}</Text>
                </View>

                <View style={styles.laudoDescriptionContainer}>
                  <Text style={styles.laudoDescriptionLabel}>Conclusões:</Text>
                  <Text style={styles.laudoDescriptionText}>{laudo.conclusoes}</Text>
                </View>

                {laudo.observacoes && (
                  <View style={styles.laudoDescriptionContainer}>
                    <Text style={styles.laudoDescriptionLabel}>Observações:</Text>
                    <Text style={styles.laudoDescriptionText}>{laudo.observacoes}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal de Criação/Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(!isModalOpen);
          setEditingLaudo(null);
          setSelectedCase(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingLaudo ? 'Editar Laudo' : 'Novo Laudo'}
              </Text>
              <TouchableOpacity onPress={() => {
                setIsModalOpen(false);
                setEditingLaudo(null);
                setSelectedCase(null);
              }}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
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
                {/* {errors.casoId && <Text style={styles.errorText}>{errors.casoId.message}</Text>} */}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Perito Responsável</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nome do perito"
                  value={editingLaudo?.perito || user?.nome || ''}
                  onChangeText={(text) => setEditingLaudo({ ...editingLaudo, perito: text })}
                />
                {/* {errors.perito && <Text style={styles.errorText}>{errors.perito.message}</Text>} */}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Descrição</Text>
                <TextInput
                  style={styles.formTextArea}
                  placeholder="Descreva o laudo pericial..."
                  multiline
                  numberOfLines={4}
                  value={editingLaudo?.descricao || ''}
                  onChangeText={(text) => setEditingLaudo({ ...editingLaudo, descricao: text })}
                />
                {/* {errors.descricao && <Text style={styles.errorText}>{errors.descricao.message}</Text>} */}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Conclusões</Text>
                <TextInput
                  style={styles.formTextArea}
                  placeholder="Conclusões do laudo pericial..."
                  multiline
                  numberOfLines={6}
                  value={editingLaudo?.conclusoes || ''}
                  onChangeText={(text) => setEditingLaudo({ ...editingLaudo, conclusoes: text })}
                />
                {/* {errors.conclusoes && <Text style={styles.errorText}>{errors.conclusoes.message}</Text>} */}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Observações</Text>
                <TextInput
                  style={styles.formTextArea}
                  placeholder="Observações adicionais (opcional)"
                  multiline
                  numberOfLines={3}
                  value={editingLaudo?.observacoes || ''}
                  onChangeText={(text) => setEditingLaudo({ ...editingLaudo, observacoes: text })}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={onSubmit}
                  disabled={createLaudo.isPending || updateLaudo.isPending}
                >
                  <Text style={styles.submitButtonText}>
                    {editingLaudo ? 'Atualizar' : 'Criar Laudo'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsModalOpen(false);
                    setEditingLaudo(null);
                    setSelectedCase(null);
                  }}
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
  newButton: {
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
  searchCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  laudosListContainer: {
    flexGrow: 1,
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
  },
  laudoCard: {
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
  laudoHeader: {
    marginBottom: 12,
  },
  laudoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  laudoTitle: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333',
    marginLeft: 8,
  },
  laudoMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  laudoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    marginLeft: 4,
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  laudoDescriptionContainer: {
    marginBottom: 8,
  },
  laudoDescriptionLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  laudoDescriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
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
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  formTextArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
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

export default LaudosScreen;
