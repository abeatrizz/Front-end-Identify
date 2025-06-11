import React, { useState, useCallback, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const EvidenceAnnotations = memo(({
  evidenceId,
  annotations,
  onAnnotationsChange,
  disabled = false
}) => {
  const [newAnnotation, setNewAnnotation] = useState('');
  const [annotationType, setAnnotationType] = useState('observation');

  const addAnnotation = useCallback(() => {
    if (!newAnnotation.trim()) return;

    const annotation = {
      id: Date.now().toString(),
      text: newAnnotation.trim(),
      author: 'Usuário Atual',
      timestamp: new Date().toLocaleString('pt-BR'),
      type: annotationType
    };

    onAnnotationsChange([...annotations, annotation]);
    setNewAnnotation('');
  }, [newAnnotation, annotationType, annotations, onAnnotationsChange]);

  const getTypeColor = useCallback((type) => {
    switch (type) {
      case 'observation': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'analysis': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'note': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  }, []);

  const getTypeLabel = useCallback((type) => {
    switch (type) {
      case 'observation': return 'Observação';
      case 'analysis': return 'Análise';
      case 'note': return 'Nota';
      default: return 'Anotação';
    }
  }, []);

  const renderAnnotation = useCallback((annotation) => (
    <View key={annotation.id} style={styles.annotationItem}>
      <View style={styles.annotationHeader}>
        <View style={[styles.badge, getTypeColor(annotation.type)]}>
          <Text style={[styles.badgeText, { color: getTypeColor(annotation.type).color }]}>
            {getTypeLabel(annotation.type)}
          </Text>
        </View>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Feather name="user" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{annotation.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{annotation.timestamp}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.annotationText}>{annotation.text}</Text>
    </View>
  ), [getTypeColor, getTypeLabel]);

  const renderTypeButton = useCallback((type) => (
    <TouchableOpacity
      key={type}
      onPress={() => setAnnotationType(type)}
      style={[
        styles.typeButton,
        annotationType === type ? styles.activeTypeButton : styles.inactiveTypeButton
      ]}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.typeButtonText,
        annotationType === type ? styles.activeTypeButtonText : styles.inactiveTypeButtonText
      ]}>
        {getTypeLabel(type)}
      </Text>
    </TouchableOpacity>
  ), [annotationType, getTypeLabel]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="edit-2" size={16} color="#111827" />
          <Text style={styles.title}>Anotações da Evidência</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {annotations.length > 0 && (
          <View style={styles.annotationsList}>
            {annotations.map(renderAnnotation)}
          </View>
        )}

        {!disabled && (
          <View style={styles.newAnnotationForm}>
            <View style={styles.typeButtons}>
              {['observation', 'analysis', 'note'].map(renderTypeButton)}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nova Anotação</Text>
              <TextInput
                placeholder="Digite sua anotação..."
                value={newAnnotation}
                onChangeText={setNewAnnotation}
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity
              onPress={addAnnotation}
              disabled={!newAnnotation.trim()}
              style={[
                styles.saveButton,
                !newAnnotation.trim() && styles.disabledButton
              ]}
              activeOpacity={0.7}
            >
              <Feather name="save" size={16} color="#ffffff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Salvar Anotação</Text>
            </TouchableOpacity>
          </View>
        )}

        {annotations.length === 0 && (
          <Text style={styles.emptyMessage}>
            Nenhuma anotação adicionada ainda
          </Text>
        )}
      </ScrollView>
    </View>
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
  header: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  annotationsList: {
    marginBottom: 16,
  },
  annotationItem: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 12,
  },
  annotationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  annotationText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  newAnnotationForm: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  activeTypeButton: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  inactiveTypeButton: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: '#ffffff',
  },
  inactiveTypeButtonText: {
    color: '#374151',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
    color: '#111827',
    minHeight: 100,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  saveIcon: {
    marginRight: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EvidenceAnnotations;