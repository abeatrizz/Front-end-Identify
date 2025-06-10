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
import { Feather } from '@expo/vector-icons'; // Para projetos Expo
// import Icon from 'react-native-vector-icons/Feather'; // Para projetos React Native CLI
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VictimManager = memo(({ victims = [], onVictimsChange, disabled = false }) => {
  const [newVictim, setNewVictim] = useState({
    name: '',
    age: '',
    gender: '',
    notes: ''
  });
  const insets = useSafeAreaInsets();

  const addVictim = useCallback(() => {
    if (!newVictim.name?.trim()) return;
    
    const victim = {
      id: Date.now().toString(),
      name: newVictim.name.trim(),
      age: newVictim.age?.trim(),
      gender: newVictim.gender?.trim(),
      notes: newVictim.notes?.trim()
    };
    
    onVictimsChange([...victims, victim]);
    setNewVictim({ name: '', age: '', gender: '', notes: '' });
  }, [newVictim, victims, onVictimsChange]);

  const removeVictim = useCallback((id) => {
    Alert.alert(
      'Remover Vítima',
      'Tem certeza que deseja remover esta vítima?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => onVictimsChange(victims.filter(v => v.id !== id))
        }
      ]
    );
  }, [victims, onVictimsChange]);

  const renderVictim = useCallback((victim) => (
    <View key={victim.id} style={styles.victimCard}>
      <View style={styles.victimContent}>
        <View style={styles.victimHeader}>
          <Text style={styles.victimName}>{victim.name}</Text>
          <View style={styles.badgesContainer}>
            {victim.age && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{victim.age} anos</Text>
              </View>
            )}
            {victim.gender && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{victim.gender}</Text>
              </View>
            )}
          </View>
        </View>
        {victim.notes && (
          <Text style={styles.victimNotes}>{victim.notes}</Text>
        )}
      </View>
      {!disabled && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeVictim(victim.id)}
          activeOpacity={0.7}
        >
          <Feather name="x" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  ), [disabled, removeVictim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Feather name="user" size={16} color="#374151" />
          <Text style={styles.headerText}>Vítimas/Pacientes</Text>
        </View>

        {/* Lista de vítimas existentes */}
        {victims.length > 0 && (
          <View style={styles.victimsList}>
            {victims.map(renderVictim)}
          </View>
        )}

        {/* Formulário para adicionar nova vítima */}
        {!disabled && (
          <View style={styles.addForm}>
            <View style={styles.formRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome*</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Nome da vítima"
                  value={newVictim.name}
                  onChangeText={(text) => setNewVictim({ ...newVictim, name: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Idade</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Idade"
                  value={newVictim.age}
                  onChangeText={(text) => setNewVictim({ ...newVictim, age: text })}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Sexo</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="M/F"
                  value={newVictim.gender}
                  onChangeText={(text) => setNewVictim({ ...newVictim, gender: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Observações</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Observações sobre a vítima"
                  value={newVictim.notes}
                  onChangeText={(text) => setNewVictim({ ...newVictim, notes: text })}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                !newVictim.name?.trim() && styles.addButtonDisabled
              ]}
              onPress={addVictim}
              disabled={!newVictim.name?.trim()}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Adicionar Vítima</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  victimsList: {
    marginBottom: 16,
  },
  victimCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  victimContent: {
    flex: 1,
  },
  victimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  victimName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  victimNotes: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#111827',
    minHeight: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 6,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VictimManager;