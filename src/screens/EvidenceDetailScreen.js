import React, { useState, useEffect } from 'react';
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
import { shadowStyles } from '../styles/shadowStyles';

const EvidenceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { caseId } = route.params;
  const { user } = useAuth();
  const { getCase } = useApiCasos();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [evidenceData, setEvidenceData] = useState(null);

  const shadowStyle = shadowStyles.medium;

  useEffect(() => {
    loadEvidence();
  }, [caseId]);

  const loadEvidence = async () => {
    try {
      setLoading(true);
  // Mock data - substituir por dados reais da API
      const mockEvidenceData = {
    id: '1',
    caseId: caseId,
    title: 'Radiografia Panorâmica',
    type: 'Imagem Radiográfica',
    captureDate: '2024-01-15',
    location: 'Clínica Odontológica Central',
        imageUrl: 'https://via.placeholder.com/400x300',
    description: 'Radiografia panorâmica completa da arcada dentária.',
    aiAnalysis: {
      completed: true,
      confidence: 0.87,
      findings: [
        'Padrão dentário único identificado',
        'Estruturas ósseas preservadas',
        'Marcadores anatômicos claros'
      ]
    }
      };
      setEvidenceData(mockEvidenceData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da evidência. Tente novamente mais tarde.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvidence();
    setRefreshing(false);
  };

  const handleAIAnalysis = () => {
    // Implementar análise de IA
    Alert.alert('Análise de IA', 'Iniciando análise de IA...');
  };

  if (loading || !evidenceData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carregando Evidência...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#123458" />
          <Text style={styles.loadingText}>Carregando detalhes da evidência...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.modalTitle}>Imagens da Evidência</Text>
            <TouchableOpacity onPress={() => setShowImageModal(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={evidenceData.images || []}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.imageThumbnail}
                onPress={() => setSelectedImage(item)}
              >
                <Image source={{ uri: item }} style={styles.thumbnail} />
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
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={() => Alert.alert('Funcionalidade', 'Adicionar imagem ainda não implementado')}
          >
            <Feather name="plus" size={24} color="#fff" />
            <Text style={styles.addImageText}>Adicionar Imagem</Text>
          </TouchableOpacity>
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
      color: '#123458',
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#123458',
    },
    badgeContainer: {
      backgroundColor: '#D4C9BE',
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    badgeText: {
      fontSize: 12,
      color: '#123458',
      fontWeight: 'bold',
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
    imageWrapper: {
      backgroundColor: '#f1f3f5',
      borderRadius: 8,
      padding: 4,
      marginBottom: 16,
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    evidenceImage: {
      width: '100%',
      height: '100%',
      borderRadius: 4,
      resizeMode: 'contain',
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
    },
    outlineButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: '#123458',
      borderRadius: 4,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    outlineButtonText: {
      color: '#123458',
      fontSize: 14,
      fontWeight: '500',
    },
    detailRow: {
      marginBottom: 12,
    },
    detailItem: {
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '500',
      color: '#1f2937',
    },
    descriptionContainer: {
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 12,
      marginTop: 4,
    },
    descriptionText: {
      fontSize: 14,
      color: '#344054',
    },
    aiAnalysisHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    aiBadge: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 'bold',
    },
    aiConfidence: {
      fontSize: 14,
      color: '#666',
    },
    aiFindingsContainer: {
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 12,
    },
    aiFindingsTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
      marginBottom: 8,
    },
    aiFindingsList: {
      gap: 4,
    },
    aiFindingItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    bullet: {
      width: 6,
      height: 6,
      backgroundColor: '#3b82f6',
      borderRadius: 3,
      marginTop: 6,
    },
    aiFindingText: {
      fontSize: 14,
      color: '#344054',
      flexShrink: 1,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    emptyStateText: {
      color: '#666',
      marginBottom: 16,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#123458',
      borderRadius: 4,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: 16,
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
    annotationsPlaceholder: {
      alignItems: 'center',
      padding: 32,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 16,
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    },
    annotationsPlaceholderText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{evidenceData.title}</Text>
          <Text style={styles.headerSubtitle}>{evidenceData.type}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Image Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Imagem da Evidência</Text>
          </View>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.imageWrapper}
              onPress={() => setShowImageModal(true)}
            >
              <Image
                source={{ uri: evidenceData.imageUrl }}
                style={styles.evidenceImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Feather name="maximize-2" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Detalhes</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data de Captura:</Text>
              <Text style={styles.detailValue}>{evidenceData.captureDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Local:</Text>
              <Text style={styles.detailValue}>{evidenceData.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Descrição:</Text>
              <Text style={styles.detailValue}>{evidenceData.description}</Text>
            </View>
          </View>
        </View>

        {/* AI Analysis Section */}
        {evidenceData.aiAnalysis && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Análise de IA</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {evidenceData.aiAnalysis.completed ? 'Concluída' : 'Em andamento'}
                </Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {evidenceData.aiAnalysis.completed ? (
                <>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confiança:</Text>
                    <Text style={styles.confidenceValue}>
                      {(evidenceData.aiAnalysis.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.findingsContainer}>
                    <Text style={styles.findingsTitle}>Achados:</Text>
                    {evidenceData.aiAnalysis.findings.map((finding, index) => (
                      <View key={index} style={styles.findingItem}>
                        <Feather name="check" size={16} color="#16a34a" />
                        <Text style={styles.findingText}>{finding}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={handleAIAnalysis}
                >
                  <Feather name="cpu" size={20} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Iniciar Análise de IA</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {renderImageModal()}
      {renderFullImageModal()}
    </SafeAreaView>
  );
};

export default EvidenceDetailScreen;
