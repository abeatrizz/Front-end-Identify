import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
// import { CaseRequest, CaseResponse } from '@/types/api'; // Removido, pois o projeto é JS
import { toast } from './use-toast';

export const useCasos = () => {
  return useQuery({
    queryKey: ['casos'],
    queryFn: async () => {
      console.log('Fetching casos...');
      const { data } = await api.get('/casos');
      console.log('Casos fetched successfully:', data);
      return data;
    },
  });
};

export const useCreateCaso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (caseData) => {
      console.log('Creating caso with data:', caseData);
      const { data } = await api.post('/casos', caseData);
      console.log('Caso created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      toast({
        title: "Caso criado!",
        description: "O caso foi criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating caso:', error);
      toast({
        title: "Erro ao criar caso",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o caso.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCaso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('Updating caso:', id, 'with data:', data);
      const { data: updatedCaso } = await api.put(`/casos/${id}`, data);
      console.log('Caso updated successfully:', updatedCaso);
      return updatedCaso;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      toast({
        title: "Caso atualizado!",
        description: "O caso foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating caso:', error);
      toast({
        title: "Erro ao atualizar caso",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o caso.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCaso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      console.log('Deleting caso:', id);
      await api.delete(`/casos/${id}`);
      console.log('Caso deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      toast({
        title: "Caso excluído!",
        description: "O caso foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting caso:', error);
      toast({
        title: "Erro ao excluir caso",
        description: error.response?.data?.message || "Ocorreu um erro ao excluir o caso.",
        variant: "destructive",
      });
    },
  });
};
