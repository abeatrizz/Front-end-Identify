import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://backend-pi-26cz.onrender.com';

// React Native storage implementation
const storage = {
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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(async (config) => {
  const { value: token } = await storage.get({ key: 'auth_token' });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.headers);
  return config;
});

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Token expirado, fazer logout
      await storage.remove({ key: 'auth_token' });
      await storage.remove({ key: 'user_data' });
      // Em React Native, precisamos usar o sistema de navegação
      // A navegação será tratada no AuthContext
    }
    return Promise.reject(error);
  }
);

export { storage };
export default api;
