import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import api from '../services/api';
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from '../services/storage';
import * as ImagePicker from 'expo-image-picker';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getToken();
      const userData = await getUser();
      
      if (token && userData) {
        setUser(userData);
        console.log('Auth status checked - user found:', userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email });
      
      const loginData = { email, password };
      console.log('Login request data:', loginData);
      
      const response = await api.post('/auth/login', loginData);
      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      console.log('Login response data:', JSON.stringify(response.data, null, 2));
      
      const { data } = response;
      
      if (!data) {
        throw new Error('Resposta da API está vazia');
      }

      if (!data.user.token) {
        console.error('Resposta da API não contém token:', data);
        throw new Error('Resposta da API não contém token');
      }

      const userData = {
        id: data.id || data.user?.id,
        nome: data.nome || data.user?.nome || data.name || data.user?.name,
        email: data.email || data.user?.email,
        role: data.role || data.user?.role,
        fotoPerfil: data.fotoPerfil || data.user?.fotoPerfil
      };

      console.log('Dados do usuário extraídos:', userData);
      
      await setToken(data.user.token);
      await setUser(userData);
      
      setUser(userData);
      Alert.alert(
        "Login realizado com sucesso!",
        `Bem-vindo, ${userData.nome}`,
        [{ text: "OK" }]
      );
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Email ou senha incorretos';
      Alert.alert(
        "Erro no login",
        errorMessage,
        [{ text: "OK" }]
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      await removeUser();
      setUser(null);
      console.log('Logout successful');
      Alert.alert(
        "Logout realizado",
        "Você foi desconectado com sucesso",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changePassword = async (senhaAtual, novaSenha) => {
    try {
      setLoading(true);
      const response = await api.put('/auth/alterar-senha', {
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
      const response = await api.put('/auth/alterar-email', { email });
      
      // Atualizar dados do usuário no estado e storage
      const updatedUser = { ...user, email };
      await setUser(updatedUser);
      setUser(updatedUser);

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
      const response = await api.put('/auth/foto-perfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Atualizar dados do usuário no estado e storage
      const updatedUser = { ...user, fotoPerfil: response.data.fotoPerfil };
      await setUser(updatedUser);
      setUser(updatedUser);

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
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
      changePassword,
      changeEmail,
      updateProfilePhoto
    }}>
      {children}
    </AuthContext.Provider>
  );
};
