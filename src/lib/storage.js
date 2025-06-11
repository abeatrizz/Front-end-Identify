import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get({ key }) {
    try {
      const value = await AsyncStorage.getItem(key);
      return { value };
    } catch {
      return { value: null };
    }
  },
  async set({ key, value }) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  async remove({ key }) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
}; 