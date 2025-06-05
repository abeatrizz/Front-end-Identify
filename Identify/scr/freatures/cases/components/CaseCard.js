import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CaseCard = memo(({ caseItem, onPress }) => {
  const handlePress = useCallback(() => {
    if (onPress && caseItem) {
      onPress(caseItem);
    }
  }, [onPress, caseItem]);

  if (!caseItem) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Caso ${caseItem.title || 'sem título'}`}
    >
      <Text style={styles.title} numberOfLines={2}>
        {caseItem.title || 'Título do Caso'}
      </Text>
      <Text style={styles.subtitle}>
        Status: {caseItem.status || 'Desconhecido'}
      </Text>
      <Text style={styles.date}>
        Data: {caseItem.date || 'N/A'}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

CaseCard.displayName = 'CaseCard';

export default CaseCard;