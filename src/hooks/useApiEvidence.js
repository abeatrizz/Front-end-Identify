import { useMutation } from '@tanstack/react-query';
import api from '../config/api';
import { toast } from '../config/toast';
import * as FileSystem from 'expo-file-system';

export const useUploadEvidence = () => {
  return useMutation({
    mutationFn: async (fileUri) => {
      const formData = new FormData();
      
      // Obter informações do arquivo
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const fileType = fileUri.split('.').pop();
      const fileName = fileUri.split('/').pop();
      
      // Criar objeto de arquivo para o FormData
      formData.append('file', {
        uri: fileUri,
        type: `image/${fileType}`,
        name: fileName,
      });
      
      const { data } = await api.post('/evidencias/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Evidência enviada!",
        description: "A evidência foi salva com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error uploading evidence:', error);
      toast({
        title: "Erro ao enviar evidência",
        description: "Ocorreu um erro no upload. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
