import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from './env';

const api = axios.create({
    baseURL: env.API_URL,
    timeout: env.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        return Promise.reject(error);
    }
});

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@user_data');
        }
        return Promise.reject(error);
    }
);

export default api; 