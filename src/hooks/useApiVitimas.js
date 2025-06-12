import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
// import { VictimaRequest, VictimaResponse } from '@/types/api'; // Removido, pois o projeto é JS
import { toast } from '../config/toast';

export const useVitimas = (casoId) => {
  return useQuery({
    queryKey: ['vitimas', casoId],
    queryFn: async () => {
      console.log('Fetching vitimas for caso:', casoId);
      const url = casoId ? `/vitimas?casoId=${casoId}` : '/vitimas';
      const { data } = await api.get(url);
      console.log('Vitimas fetched successfully:', data);
      return data;
    },
    enabled: !!casoId,
  });
};

export const useCreateVitima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vitimaData) => {
      console.log('Creating vitima with data:', vitimaData);
      const { data } = await api.post('/vitimas', vitimaData);
      console.log('Vitima created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vitimas'] });
      queryClient.invalidateQueries({ queryKey: ['vitimas', data.casoId] });
      toast({
        title: "Vítima cadastrada!",
        description: "A vítima foi cadastrada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating vitima:', error);
      toast({
        title: "Erro ao cadastrar vítima",
        description: error.response?.data?.message || "Ocorreu um erro ao cadastrar a vítima.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVitima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('Updating vitima:', id, 'with data:', data);
      const { data: updatedVitima } = await api.put(`/vitimas/${id}`, data);
      console.log('Vitima updated successfully:', updatedVitima);
      return updatedVitima;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vitimas'] });
      queryClient.invalidateQueries({ queryKey: ['vitimas', data.casoId] });
      toast({
        title: "Vítima atualizada!",
        description: "A vítima foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating vitima:', error);
      toast({
        title: "Erro ao atualizar vítima",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar a vítima.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteVitima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      console.log('Deleting vitima:', id);
      await api.delete(`/vitimas/${id}`);
      console.log('Vitima deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitimas'] });
      toast({
        title: "Vítima excluída!",
        description: "A vítima foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting vitima:', error);
      toast({
        title: "Erro ao excluir vítima",
        description: error.response?.data?.message || "Ocorreu um erro ao excluir a vítima.",
        variant: "destructive",
      });
    },
  });
};
