import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@Identify:token';
const USER_KEY = '@Identify:user';

export const storage = {
    async get(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value === null) return null;
            try {
                return JSON.parse(value);
            } catch (e) {
                return value; // Retorna o valor bruto se não for JSON válido
            }
        } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
        }
    },

    async set(key, value) {
        try {
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
            await AsyncStorage.setItem(key, valueToStore);
        } catch (error) {
            console.error('Error setting item in storage:', error);
        }
    },

    async remove(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from storage:', error);
        }
    },

    async clear() {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
};

export const setToken = (token) => storage.set(TOKEN_KEY, token);
export const getToken = () => storage.get(TOKEN_KEY);
export const removeToken = () => storage.remove(TOKEN_KEY);

export const setUser = (user) => storage.set(USER_KEY, user);
export const getUser = () => storage.get(USER_KEY);
export const removeUser = () => storage.remove(USER_KEY); 