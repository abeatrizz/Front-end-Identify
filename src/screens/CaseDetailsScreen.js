import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApiCasos } from '../hooks/useApiCasos';
import { useAuth } from '../hooks/useAuth';

const CaseDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { user } = useAuth();
  const { getCase, updateCase, deleteCase } = useApiCasos();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    caseNumber: '',
    location: '',
    description: '',
    requestDate: '',
    priority: 'Normal',
    status: 'Em andamento'
  });

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    try {
      setLoading(true);
      const caso = await getCase(id);
      if (caso) {
        setFormData({
          caseNumber: caso.caseNumber || '',
          location: caso.location || '',
          description: caso.description || '',
          requestDate: caso.requestDate || '',
          priority: caso.priority || 'Normal',
          status: caso.status || 'Em andamento'
        });
        setImages(caso.images || []);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do caso. Tente novamente mais tarde.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCase();
    setRefreshing(false);
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente mais tarde.');
    }
  };

  const removeImage = (index) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja remover esta imagem?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setImages(prev => prev.filter((_, i) => i !== index));
          }
        }
      ]
    );
  };

  const validateForm = () => {
    if (!formData.caseNumber.trim()) {
      Alert.alert('Erro', 'Por favor, digite o número do caso');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Erro', 'Por favor, adicione a localização do caso');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Por favor, digite a descrição do caso');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const success = await updateCase(id, {
        ...formData,
        images
      });

      if (success) {
        Alert.alert('Sucesso', 'Caso atualizado com sucesso!');
        setIsEditing(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o caso. Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita.',
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
              setSaving(true);
              const success = await deleteCase(id);
              if (success) {
                Alert.alert('Sucesso', 'Caso excluído com sucesso!');
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o caso. Tente novamente mais tarde.');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const renderImageModal = () => (
    <Modal
      visible={showImageModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowImageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Imagens do Caso</Text>
            <TouchableOpacity onPress={() => setShowImageModal(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.imageThumbnail}
                onPress={() => setSelectedImage(item)}
              >
                <Image source={{ uri: item }} style={styles.thumbnail} />
                {isEditing && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyImagesContainer}>
                <Feather name="image" size={48} color="#ccc" />
                <Text style={styles.emptyImagesText}>
                  Nenhuma imagem adicionada
                </Text>
              </View>
            }
          />
          {isEditing && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleImageUpload}
            >
              <Feather name="plus" size={24} color="#fff" />
              <Text style={styles.addImageText}>Adicionar Imagem</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderFullImageModal = () => (
    <Modal
      visible={!!selectedImage}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedImage(null)}
    >
      <View style={styles.fullImageModalOverlay}>
        <TouchableOpacity
          style={styles.fullImageCloseButton}
          onPress={() => setSelectedImage(null)}
        >
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: selectedImage }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Caso</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#123458" />
          <Text style={styles.loadingText}>Carregando detalhes do caso...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Caso</Text>
        {!isEditing ? (
          <View style={styles.headerButtons}>
            {user?.tipoUsuario === 'admin' && (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                  disabled={saving}
                >
                  <Feather name="edit" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                  disabled={saving}
                >
                  <Feather name="trash-2" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : null}
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informações do Caso</Text>
            <TouchableOpacity
              style={styles.imagesButton}
              onPress={() => setShowImageModal(true)}
            >
              <Feather name="image" size={20} color="#123458" />
              <Text style={styles.imagesButtonText}>
                {images.length} {images.length === 1 ? 'imagem' : 'imagens'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número do Caso</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.caseNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, caseNumber: text }))}
                placeholder="Digite o número do caso"
                editable={isEditing && !saving}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Localização</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Digite a localização do caso"
                editable={isEditing && !saving}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Descreva os detalhes do caso"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={isEditing && !saving}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data da Solicitação</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.requestDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, requestDate: text }))}
                placeholder="DD/MM/AAAA"
                editable={isEditing && !saving}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.selectContainer}>
                {['Baixa', 'Normal', 'Alta'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      formData.priority === priority && styles.priorityButtonSelected,
                      !isEditing && styles.priorityButtonDisabled
                    ]}
                    onPress={() => {
                      if (isEditing && !saving) {
                        setFormData(prev => ({ ...prev, priority }));
                      }
                    }}
                    disabled={!isEditing || saving}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      formData.priority === priority && styles.priorityButtonTextSelected
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.selectContainer}>
                {['Em andamento', 'Finalizado', 'Arquivado'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && styles.statusButtonSelected,
                      !isEditing && styles.statusButtonDisabled
                    ]}
                    onPress={() => {
                      if (isEditing && !saving) {
                        setFormData(prev => ({ ...prev, status }));
                      }
                    }}
                    disabled={!isEditing || saving}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === status && styles.statusButtonTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                Alert.alert(
                  'Cancelar edição',
                  'Tem certeza que deseja cancelar a edição? As alterações serão perdidas.',
                  [
                    {
                      text: 'Não',
                      style: 'cancel'
                    },
                    {
                      text: 'Sim',
                      onPress: () => {
                        loadCase();
                        setIsEditing(false);
                      }
                    }
                  ]
                );
              }}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {renderImageModal()}
      {renderFullImageModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123458',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123458',
  },
  imagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imagesButtonText: {
    fontSize: 14,
    color: '#123458',
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#123458',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  inputDisabled: {
    backgroundColor: '#f1f3f5',
    color: '#666',
  },
  textArea: {
    height: 100,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: '#123458',
  },
  priorityButtonDisabled: {
    opacity: 0.7,
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  priorityButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: '#123458',
  },
  statusButtonDisabled: {
    opacity: 0.7,
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666',
  },
  statusButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  saveButton: {
    backgroundColor: '#123458',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
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
  imageThumbnail: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  emptyImagesContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyImagesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#123458',
    padding: 16,
    borderRadius: 4,
    marginTop: 16,
  },
  addImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fullImageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageCloseButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 1,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});

export default CaseDetailsScreen; 