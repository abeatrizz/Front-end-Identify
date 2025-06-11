import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';
import fazerLogin from '../utils/apiDiagnostics';

export const useLogin = () => {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      return await fazerLogin(credentials.email, credentials.senha);
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      signIn(data.token, data.user);
      Alert.alert(
        "Sucesso",
        `Login realizado com sucesso!\nBem-vindo, ${data.user.username}`
      );
    },
    onError: (error) => {
      console.error('Login error:', error);
      Alert.alert(
        "Erro no login",
        error.message
      );
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      console.log('Tentando recuperar senha para:', email);
      console.log('URL completa:', `${api.defaults.baseURL}/auth/recuperar-senha`);
      const { data } = await api.post('/auth/recuperar-senha', { email });
      console.log('Resposta da API:', data);
      return data;
    },
    onSuccess: () => {
      Alert.alert(
        "Sucesso",
        "Enviamos um link para redefinir sua senha."
      );
    },
    onError: (error) => {
      console.error('Forgot password error:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      const errorMessage = error.response?.data?.message || 'Erro ao enviar email de recuperação';
      Alert.alert(
        "Erro ao enviar email",
        errorMessage
      );
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      console.log('Attempting register with:', userData);
      const { data } = await api.post('/auth/register', {
        username: userData.username,
        cargo: userData.cargo,
        email: userData.email,
        senha: userData.senha
      });
      return data;
    },
    onSuccess: (data) => {
      console.log('Register successful:', data);
      Alert.alert(
        "Sucesso",
        `Cadastro realizado com sucesso!\nBem-vindo, ${data.user.username}`
      );
    },
    onError: (error) => {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao realizar cadastro';
      Alert.alert(
        "Erro no cadastro",
        errorMessage
      );
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ senhaAtual, novaSenha }) => {
      const { data } = await api.put('/auth/alterar-senha', {
        senhaAtual,
        novaSenha
      });
      return data;
    },
    onSuccess: () => {
      Alert.alert(
        "Sucesso",
        "Senha alterada com sucesso!"
      );
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Erro ao alterar senha';
      Alert.alert(
        "Erro ao alterar senha",
        errorMessage
      );
    },
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const { data } = await api.put('/auth/alterar-email', { email });
      return data;
    },
    onSuccess: (data) => {
      Alert.alert(
        "Sucesso",
        "Email alterado com sucesso!"
      );
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Erro ao alterar email';
      Alert.alert(
        "Erro ao alterar email",
        errorMessage
      );
    },
  });
};

export const useUpdateProfilePhoto = () => {
  return useMutation({
    mutationFn: async () => {
      // Solicitar permissão para acessar a biblioteca de mídia
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão para acessar a biblioteca de mídia negada');
      }

      // Selecionar imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (result.canceled) {
        throw new Error('Seleção de imagem cancelada');
      }

      // Criar FormData para upload
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const { data } = await api.put('/auth/atualizar-foto-perfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      Alert.alert(
        "Sucesso",
        "Foto de perfil atualizada com sucesso!"
      );
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar foto de perfil';
      Alert.alert(
        "Erro ao atualizar foto",
        errorMessage
      );
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/auth/users');
      return data;
    },
  });
};

export const useDeactivateUser = () => {
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.put(`/auth/desativar-usuario/${userId}`);
      return data;
    },
    onSuccess: () => {
      Alert.alert(
        "Sucesso",
        "Usuário desativado com sucesso!"
      );
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Erro ao desativar usuário';
      Alert.alert(
        "Erro ao desativar usuário",
        errorMessage
      );
    },
  });
};

export const useReactivateUser = () => {
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.put(`/auth/reativar-usuario/${userId}`);
      return data;
    },
    onSuccess: () => {
      Alert.alert(
        "Sucesso",
        "Usuário reativado com sucesso!"
      );
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Erro ao reativar usuário';
      Alert.alert(
        "Erro ao reativar usuário",
        errorMessage
      );
    },
  });
};
