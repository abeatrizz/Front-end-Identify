import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { shadowStyles } from '../styles/shadowStyles';

const EvidenceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { caseId } = route.params;
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data do caso - em produção, buscar da API
  const caseStatus = 'Em andamento'; // 'Em andamento', 'Arquivado', 'Concluído'
  const canAddEvidence = caseStatus === 'Em andamento';

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Erro', 'Precisamos de permissão para acessar sua câmera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImages(prev => [...prev, result.assets[0].uri]);
        Alert.alert("Foto capturada!", "Imagem adicionada às evidências.");
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert("Erro ao capturar foto", "Verifique as permissões da câmera.");
    }
  };

  const selectFromGallery = async () => {
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
        Alert.alert("Imagem selecionada!", "Imagem adicionada às evidências.");
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert("Erro ao selecionar imagem", "Tente novamente.");
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos uma imagem");
      return;
    }

    setLoading(true);

    try {
      // Simular upload das evidências
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert("Evidências salvas!", `${images.length} imagens foram enviadas com sucesso.`);
      
      navigation.navigate('CaseDetails', { id: caseId });
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar evidências. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (!canAddEvidence) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('CaseDetails', { id: caseId })}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Evidências do Caso</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Status Warning */}
          <View style={styles.cardWarning}>
            <View style={styles.cardWarningContent}>
              <Feather name="alert-circle" size={24} color="#f97316" />
              <View style={styles.warningTextContainer}>
                <Text style={styles.warningTitle}>Caso não permite novas evidências</Text>
                <Text style={styles.warningMessage}>
                  Este caso está com status "{caseStatus}" e não permite adição de novas evidências.
                </Text>
              </View>
            </View>
          </View>

          {/* Existing Evidences - Mock data */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Evidências Existentes</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.evidenceList}>
                <View style={styles.evidenceItem}>
                  <View style={styles.evidenceInfo}>
                    <Text style={styles.evidenceTitle}>Radiografia panorâmica</Text>
                    <Text style={styles.evidenceSubtitle}>Foto • 2024-01-15</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('EvidenceDetail', { caseId: caseId, evidenceId: '1' })}
                  >
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.evidenceItem}>
                  <View style={styles.evidenceInfo}>
                    <Text style={styles.evidenceTitle}>Foto intraoral</Text>
                    <Text style={styles.evidenceSubtitle}>Foto • 2024-01-15</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('EvidenceDetail', { caseId: caseId, evidenceId: '2' })}
                  >
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('CaseDetails', { id: caseId })}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Capturar Evidências</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Status: {caseStatus}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Camera Actions */}
        <View style={styles.cameraActionsContainer}>
          <TouchableOpacity
            onPress={takePhoto}
            style={styles.actionButtonPrimary}
          >
            <Feather name="camera" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={selectFromGallery}
            style={styles.actionButtonOutline}
          >
            <Feather name="upload" size={24} color="#123458" />
            <Text style={styles.actionButtonTextOutline}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* Images Preview */}
        {images.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Imagens Capturadas ({images.length})</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.imageGrid}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={styles.removeImageButton}
                    >
                      <Feather name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Description Input */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="file-text" size={20} color="#123458" />
            <Text style={styles.cardTitle}>Descrição da Evidência</Text>
          </View>
          <View style={styles.cardContent}>
            <TextInput
              style={styles.textArea}
              placeholder="Adicione uma descrição detalhada da evidência..."
              placeholderTextColor="#666"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Salvar Evidências</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    ...shadowStyles.medium,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    backgroundColor: '#D4C9BE',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#123458',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardWarning: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    ...shadowStyles.medium,
  },
  cardWarningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9a3412',
    marginBottom: 4,
  },
  warningMessage: {
    fontSize: 14,
    color: '#c2410c',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...shadowStyles.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123458',
  },
  cardContent: {
    padding: 16,
  },
  evidenceList: {
    gap: 8,
  },
  evidenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  evidenceSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: '#123458',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cameraActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#123458',
    borderRadius: 8,
    paddingVertical: 16,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#123458',
    borderRadius: 8,
    paddingVertical: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextOutline: {
    color: '#123458',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imagePreviewContainer: {
    width: '48%', // Adjusted for gap
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#123458',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default EvidenceScreen;
