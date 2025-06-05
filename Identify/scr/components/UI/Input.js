import React, { useCallback } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  editable = true,
  style
}) => {
  const handleChangeText = useCallback((text) => {
    if (onChangeText) {
      onChangeText(text);
    }
  }, [onChangeText]);

  return (
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled, style]}
      value={value || ''}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      editable={editable}
      autoCorrect={false}
      accessible
      accessibilityLabel={placeholder}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    color: '#999',
  },
});

export default Input;