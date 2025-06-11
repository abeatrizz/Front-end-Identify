import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/auth';
import { Alert } from 'react-native';
import api from '../config/api';
import { storage } from '../lib/storage';

import * as ImagePicker from 'expo-image-picker';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } else {
        // Garantir que o usuário não está autenticado se não houver token
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Em caso de erro, garantir que o usuário não está autenticado
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const data = await loginUser(email, senha);
      
      if (data.token) {
        console.log('Token recebido do login:', data.token.substring(0, 20) + '...');
        await AsyncStorage.setItem('@auth_token', data.token);
        await AsyncStorage.setItem('@user_data', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_data');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const changePassword = async (senhaAtual, novaSenha) => {
    try {
      setLoading(true);
      await api.put('/auth/alterar-senha', {
        senhaAtual,
        novaSenha
      });

      Alert.alert(
        "Sucesso",
        "Senha alterada com sucesso!",
        [{ text: "OK" }]
      );
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
      Alert.alert(
        "Erro",
        errorMessage,
        [{ text: "OK" }]
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (email) => {
    try {
      setLoading(true);
      await api.put('/auth/alterar-email', { email });
      
      // Atualizar dados do usuário no estado e storage
      const updatedUser = { ...user, email };
      setUser(updatedUser);
      await storage.set({ key: 'user_data', value: JSON.stringify(updatedUser) });

      Alert.alert(
        "Sucesso",
        "Email alterado com sucesso!",
        [{ text: "OK" }]
      );
      return true;
    } catch (error) {
      console.error('Change email error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao alterar email';
      Alert.alert(
        "Erro",
        errorMessage,
        [{ text: "OK" }]
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePhoto = async () => {
    try {
      setLoading(true);

      // Solicitar permissão para acessar a galeria
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Precisamos de permissão para acessar suas fotos');
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (result.canceled) {
        throw new Error('Nenhuma imagem selecionada');
      }

      // Criar FormData com a imagem
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      // Enviar para a API
      const { data } = await api.put('/auth/foto-perfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Atualizar dados do usuário no estado e storage
      const updatedUser = { ...user, fotoPerfil: data.fotoPerfil };
      setUser(updatedUser);
      await storage.set({ key: 'user_data', value: JSON.stringify(updatedUser) });

      Alert.alert(
        "Sucesso",
        "Foto de perfil atualizada com sucesso!",
        [{ text: "OK" }]
      );
      return true;
    } catch (error) {
      console.error('Update profile photo error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar foto';
      Alert.alert(
        "Erro",
        errorMessage,
        [{ text: "OK" }]
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      changePassword,
      changeEmail,
      updateProfilePhoto
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};