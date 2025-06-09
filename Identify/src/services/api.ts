
import axios from 'axios';

const API_BASE_URL = 'https://backend-pi-26cz.onrender.com';

// Web-compatible storage fallback
const webStorage = {
  async get(options: { key: string }) {
    try {
      const value = localStorage.getItem(options.key);
      return { value };
    } catch {
      return { value: null };
    }
  },
  async set(options: { key: string; value: string }) {
    try {
      localStorage.setItem(options.key, options.value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  async remove(options: { key: string }) {
    try {
      localStorage.removeItem(options.key);
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
  const { value: token } = await webStorage.get({ key: 'auth_token' });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, fazer logout
      await webStorage.remove({ key: 'auth_token' });
      await webStorage.remove({ key: 'user_data' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { webStorage };
export default api;
