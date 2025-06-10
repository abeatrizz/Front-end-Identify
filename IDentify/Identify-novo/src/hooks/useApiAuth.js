import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from '@/hooks/use-toast';
import * as ImagePicker from 'expo-image-picker';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      console.log('Attempting login with:', credentials);
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${data.usuario.nome}`,
      });
    },
    onError: (error) => {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Email ou senha incorretos';
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      console.log('Attempting register with:', userData);
      const { data } = await api.post('/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      console.log('Register successful:', data);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo, ${data.usuario.nome}`,
      });
    },
    onError: (error) => {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao realizar cadastro';
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
      toast({
        title: "Erro ao alterar senha",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const { data } = await api.put('/auth/alterar-email', { email });
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Email alterado!",
        description: "Seu email foi alterado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Change email error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao alterar email';
      toast({
        title: "Erro ao alterar email",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });
};

export const useUpdateProfilePhoto = () => {
  return useMutation({
    mutationFn: async () => {
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
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Update profile photo error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar foto';
      toast({
        title: "Erro ao atualizar foto",
        description: errorMessage,
        variant: "destructive"
      });
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
    mutationFn: async ({ id, motivo }) => {
      const { data } = await api.put(`/auth/users/${id}/desativar`, { motivo });
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Usuário desativado!",
        description: "O usuário foi desativado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Deactivate user error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao desativar usuário';
      toast({
        title: "Erro ao desativar usuário",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });
};

export const useReactivateUser = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.put(`/auth/users/${id}/reativar`);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Usuário reativado!",
        description: "O usuário foi reativado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Reactivate user error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao reativar usuário';
      toast({
        title: "Erro ao reativar usuário",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });
};
