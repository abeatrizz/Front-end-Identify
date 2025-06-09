
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { UploadResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useUploadEvidence = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      
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
