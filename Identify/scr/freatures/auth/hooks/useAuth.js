import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.seuapp.com';
const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const storeUserData = async (token, userData) => {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [USER_KEY, JSON.stringify(userData)]
      ]);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  const getUserData = async () => {
    try {
      const values = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
      const token = values[0][1];
      const userData = values[1][1] ? JSON.parse(values[1][1]) : null;
      return { token, userData };
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return { token: null, userData: null };
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
    }
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const { token, userData } = await getUserData();
      
      if (token && userData) {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          await clearUserData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setInitializing(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await storeUserData(data.token, data.user);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.message || 'Credenciais inválidas';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Problema de conexão com o servidor');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    const { email, password, name } = userData;

    if (!name || name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await storeUserData(data.token, data.user);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.message || 'Erro ao criar conta';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Problema de conexão com o servidor');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      const { token } = await getUserData();
      
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      await clearUserData();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        const errorMessage = data.message || 'Email não encontrado';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Problema de conexão com o servidor');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);

    try {
      const { token } = await getUserData();
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        await storeUserData(token, data.user);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.message || 'Erro ao atualizar perfil';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Problema de conexão com o servidor');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isAuthenticated,
    loading,
    initializing,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    checkAuthStatus,
  };
};