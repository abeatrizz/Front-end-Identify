import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToothIllustration from './ToothIllustration';

const DentalChart = memo(({
  evidences,
  onEvidenceAdd,
  onEvidenceRemove,
  onImageUpload,
  disabled = false
}) => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [notes, setNotes] = useState('');
  const insets = useSafeAreaInsets();

  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const handleToothClick = useCallback((toothNumber) => {
    if (disabled) return;
    setSelectedTooth(toothNumber);
  }, [disabled]);

  const handleAddEvidence = useCallback(() => {
    if (!selectedTooth) return;
    
    onEvidenceAdd({
      toothNumber: selectedTooth,
      notes: notes.trim() || undefined
    });
    
    setSelectedTooth(null);
    setNotes('');
  }, [selectedTooth, notes, onEvidenceAdd]);

  const handleImageUpload = useCallback(async () => {
    if (!selectedTooth) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É necessário permitir acesso à galeria para adicionar imagens');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImageUpload(selectedTooth, result.assets[0]);
    }
  }, [selectedTooth, onImageUpload]);

  const hasEvidence = useCallback((toothNumber) => {
    return evidences.some(e => e.toothNumber === toothNumber);
  }, [evidences]);

  const renderTooth = useCallback((tooth) => (
    <View key={tooth} style={styles.toothContainer}>
      <ToothIllustration
        toothNumber={tooth}
        hasEvidence={hasEvidence(tooth)}
        onPress={() => handleToothClick(tooth)}
        size="sm"
      />
    </View>
  ), [hasEvidence, handleToothClick]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Diagrama Dentário</Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.diagramSection}>
              <Text style={styles.arcadeLabel}>Arcada Superior</Text>
              <View style={styles.teethRow}>
                {upperTeeth.map(renderTooth)}
              </View>
            </View>

            <View style={styles.diagramSection}>
              <View style={styles.teethRow}>
                {lowerTeeth.map(renderTooth)}
              </View>
              <Text style={styles.arcadeLabel}>Arcada Inferior</Text>
            </View>

            {evidences.length > 0 && (
              <View style={styles.evidencesSection}>
                <Text style={styles.sectionLabel}>Evidências Registradas:</Text>
                <View style={styles.evidencesGrid}>
                  {evidences.map(evidence => (
                    <View key={evidence.toothNumber} style={styles.evidenceItem}>
                      <Text style={styles.evidenceText}>Dente {evidence.toothNumber}</Text>
                      {!disabled && (
                        <TouchableOpacity
                          onPress={() => onEvidenceRemove(evidence.toothNumber)}
                          style={styles.removeButton}
                          activeOpacity={0.7}
                        >
                          <Feather name="x" size={12} color="#6b7280" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedTooth && !disabled && (
              <View style={styles.selectedToothForm}>
                <Text style={styles.selectedToothTitle}>Dente {selectedTooth} Selecionado</Text>
                
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Observações</Text>
                  <TextInput
                    placeholder="Observações sobre este dente..."
                    value={notes}
                    onChangeText={setNotes}
                    style={styles.textInput}
                    multiline
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Imagem do Dente</Text>
                  <TouchableOpacity
                    onPress={handleImageUpload}
                    style={styles.uploadButton}
                    activeOpacity={0.7}
                  >
                    <Feather name="upload" size={16} color="#374151" style={styles.uploadIcon} />
                    <Text style={styles.uploadButtonText}>Adicionar Imagem</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={handleAddEvidence}
                    style={styles.addButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addButtonText}>Adicionar Evidência</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedTooth(null)}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!disabled && (
              <Text style={styles.helpText}>
                Clique em um dente para adicionar evidência
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  diagramSection: {
    marginBottom: 16,
  },
  arcadeLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  teethRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  toothContainer: {
    margin: 2,
  },
  evidencesSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  evidencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    minWidth: '45%',
  },
  evidenceText: {
    fontSize: 14,
    color: '#111827',
  },
  removeButton: {
    padding: 4,
  },
  selectedToothForm: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  selectedToothTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default DentalChart;