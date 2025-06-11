import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const EvidenceCard = ({ evidence, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Feather name="file-text" size={24} color="#123458" />
        <Text style={styles.title}>{evidence.title}</Text>
      </View>
      <Text style={styles.description}>{evidence.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#123458',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default EvidenceCard; 