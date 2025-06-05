import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key, value) => {
  try {
    if (!key) {
      throw new Error('Key é obrigatória');
    }
    
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
};

export const getItem = async (key) => {
  try {
    if (!key) {
      throw new Error('Key é obrigatória');
    }
    
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados:', error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    if (!key) {
      throw new Error('Key é obrigatória');
    }
    
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao remover dados:', error);
    return false;
  }
};