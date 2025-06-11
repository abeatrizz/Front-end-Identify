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
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Plus, User, Edit, Trash2, Search } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { useVitimas, useCreateVitima, useUpdateVitima, useDeleteVitima } from '../hooks/useApiVitimas';
import StandardHeader from '../components/StandardHeader';

const VitimasScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { caseId } = route.params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVitima, setEditingVitima] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vitimas = [], isLoading, refetch } = useVitimas(caseId);
  const createVitima = useCreateVitima();
  const updateVitima = useUpdateVitima();
  const deleteVitima = useDeleteVitima();

  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    nic: '',
    nome: '',
    genero: 'Não informado',
    idade: '',
    documento: '',
    endereco: '',
    corEtnia: 'Não informado',
    observacoes: '',
  });

  useEffect(() => {
    if (editingVitima) {
      setFormData({
        nic: editingVitima.nic || '',
        nome: editingVitima.nome || '',
        genero: editingVitima.genero || 'Não informado',
        idade: editingVitima.idade ? String(editingVitima.idade) : '',
        documento: editingVitima.documento || '',
        endereco: editingVitima.endereco || '',
        corEtnia: editingVitima.corEtnia || 'Não informado',
        observacoes: editingVitima.observacoes || '',
      });
    } else {
      setFormData({
        nic: '',
        nome: '',
        genero: 'Não informado',
        idade: '',
        documento: '',
        endereco: '',
        corEtnia: 'Não informado',
        observacoes: '',
      });
    }
  }, [editingVitima]);

  const filteredVitimas = vitimas.filter(vitima =>
    vitima.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vitima.nic?.includes(searchTerm)
  );

  const formatCPF = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?$/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join('.');
    }
    return text;
  };

  const validateForm = () => {
    if (!formData.nic.trim()) {
      Alert.alert('Erro', 'NIC é obrigatório.');
      return false;
    }
    if (formData.nic.replace(/\D/g, '').length !== 8) {
      Alert.alert('Erro', 'NIC deve ter exatamente 8 dígitos.');
      return false;
    }
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório.');
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    try {
      const vitimaData = {
        ...formData,
        casoId: caseId,
        idade: formData.idade ? parseInt(formData.idade) : undefined,
      };

      if (editingVitima) {
        await updateVitima.mutateAsync({ id: editingVitima._id, data: vitimaData });
      } else {
        await createVitima.mutateAsync(vitimaData);
      }

      setIsModalOpen(false);
      setEditingVitima(null);
      refetch();
      Alert.alert('Sucesso', `Vítima ${editingVitima ? 'atualizada' : 'cadastrada'} com sucesso!`);
    } catch (error) {
      console.error('Error saving vitima:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a vítima.');
    }
  };

  const handleEdit = (vitima) => {
    setEditingVitima(vitima);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir esta vítima?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteVitima.mutateAsync(id);
              refetch();
              Alert.alert('Sucesso', 'Vítima excluída com sucesso!');
            } catch (error) {
              console.error('Error deleting vitima:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir a vítima.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StandardHeader title="Vítimas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando vítimas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StandardHeader
        title="Vítimas"
        rightElement={
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => {
              setEditingVitima(null);
              setIsModalOpen(true);
            }}
          >
            <Feather name="plus" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Nova</Text>
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
        {/* Busca */}
        <View style={styles.searchCard}>
          <View style={styles.searchInputContainer}>
            <Search name="search" size={16} color="gray" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar por nome ou NIC..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Lista de Vítimas */}
        <View style={styles.vitimasListContainer}>
          {filteredVitimas.length === 0 ? (
            <View style={styles.emptyCard}>
              <User name="user" size={48} color="#ccc" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Nenhuma vítima encontrada</Text>
            </View>
          ) : (
            filteredVitimas.map((vitima) => (
              <View key={vitima._id} style={styles.vitimaCard}>
                <View style={styles.vitimaInfo}>
                  <View style={styles.vitimaTitleContainer}>
                    <Text style={styles.vitimaName}>{vitima.nome}</Text>
                    <View style={styles.nicBadge}>
                      <Text style={styles.nicBadgeText}>NIC: {vitima.nic}</Text>
                    </View>
                  </View>
                  <View style={styles.vitimaDetailsGrid}>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>👤</Text> {vitima.genero}</Text>
                    {vitima.idade && <Text style={styles.detailText}><Text style={styles.detailLabel}>🎂</Text> {vitima.idade} anos</Text>}
                    {vitima.corEtnia && <Text style={styles.detailText}><Text style={styles.detailLabel}>🏷️</Text> {vitima.corEtnia}</Text>}
                    {vitima.documento && <Text style={styles.detailText}><Text style={styles.detailLabel}>📄</Text> {vitima.documento}</Text>}
                    {vitima.endereco && <Text style={styles.detailText}><Text style={styles.detailLabel}>🏠</Text> {vitima.endereco}</Text>}
                  </View>
                  {vitima.observacoes && (
                    <Text style={styles.vitimaObservacoes}>{vitima.observacoes}</Text>
                  )}
                </View>

                <View style={styles.vitimaActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(vitima)}
                  >
                    <Edit name="edit" size={16} color="#2563eb" />
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(vitima._id)}
                  >
                    <Trash2 name="trash-2" size={16} color="#dc2626" />
                    <Text style={styles.actionButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
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
          setIsModalOpen(false);
          setEditingVitima(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingVitima ? 'Editar Vítima' : 'Nova Vítima'}
              </Text>
              <TouchableOpacity onPress={() => {
                setIsModalOpen(false);
                setEditingVitima(null);
              }}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>NIC (8 dígitos)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.nic}
                  onChangeText={(text) => setFormData({ ...formData, nic: formatCPF(text) })}
                  placeholder="123.456.78"
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                  placeholder="Nome da vítima"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Gênero</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.genero}
                    onValueChange={(itemValue) => setFormData({ ...formData, genero: itemValue })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Masculino" value="Masculino" />
                    <Picker.Item label="Feminino" value="Feminino" />
                    <Picker.Item label="Não informado" value="Não informado" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Idade</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.idade}
                  onChangeText={(text) => setFormData({ ...formData, idade: text.replace(/\D/g, '') })}
                  placeholder="25"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cor/Etnia</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.corEtnia}
                    onValueChange={(itemValue) => setFormData({ ...formData, corEtnia: itemValue })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Branca" value="Branca" />
                    <Picker.Item label="Preta" value="Preta" />
                    <Picker.Item label="Parda" value="Parda" />
                    <Picker.Item label="Amarela" value="Amarela" />
                    <Picker.Item label="Indígena" value="Indígena" />
                    <Picker.Item label="Não informado" value="Não informado" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Documento</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.documento}
                  onChangeText={(text) => setFormData({ ...formData, documento: text })}
                  placeholder="CPF, RG ou outro documento"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Endereço</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.endereco}
                  onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                  placeholder="Endereço completo"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Observações</Text>
                <TextInput
                  style={styles.formTextArea}
                  value={formData.observacoes}
                  onChangeText={(text) => setFormData({ ...formData, observacoes: text })}
                  placeholder="Observações adicionais"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={onSubmit}
                  disabled={createVitima.isPending || updateVitima.isPending}
                >
                  <Text style={styles.submitButtonText}>
                    {editingVitima ? 'Atualizar' : 'Cadastrar'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsModalOpen(false);
                    setEditingVitima(null);
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
  vitimasListContainer: {
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
  vitimaCard: {
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
  vitimaInfo: {
    flex: 1,
  },
  vitimaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitimaName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333',
    marginRight: 8,
  },
  nicBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  nicBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338ca',
  },
  vitimaDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#444',
  },
  vitimaObservacoes: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 8,
  },
  vitimaActions: {
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
    marginLeft: 4,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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

export default VitimasScreen;
