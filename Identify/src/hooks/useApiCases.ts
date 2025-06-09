
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { CaseRequest, CaseResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useCases = () => {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async (): Promise<CaseResponse[]> => {
      const { data } = await api.get('/casos');
      return data;
    },
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (caseData: CaseRequest): Promise<CaseResponse> => {
      const { data } = await api.post('/casos', caseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast({
        title: "Caso criado com sucesso!",
        description: "O novo caso foi adicionado ao sistema.",
      });
    },
    onError: (error) => {
      console.error('Error creating case:', error);
      toast({
        title: "Erro ao criar caso",
        description: "Ocorreu um erro ao criar o caso. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CaseRequest> }): Promise<CaseResponse> => {
      const { data: response } = await api.put(`/casos/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast({
        title: "Caso atualizado!",
        description: "As informações do caso foram atualizadas.",
      });
    },
    onError: (error) => {
      console.error('Error updating case:', error);
      toast({
        title: "Erro ao atualizar caso",
        description: "Ocorreu um erro ao atualizar o caso.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/casos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast({
        title: "Caso excluído",
        description: "O caso foi removido do sistema.",
      });
    },
    onError: (error) => {
      console.error('Error deleting case:', error);
      toast({
        title: "Erro ao excluir caso",
        description: "Ocorreu um erro ao excluir o caso.",
        variant: "destructive",
      });
    },
  });
};
