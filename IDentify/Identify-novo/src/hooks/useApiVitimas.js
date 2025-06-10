
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { VictimaRequest, VictimaResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useVitimas = (casoId?: string) => {
  return useQuery({
    queryKey: ['vitimas', casoId],
    queryFn: async (): Promise<VictimaResponse[]> => {
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
    mutationFn: async (vitimaData: VictimaRequest): Promise<VictimaResponse> => {
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
    onError: (error: any) => {
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<VictimaRequest> }): Promise<VictimaResponse> => {
      console.log('Updating vitima:', id, 'with data:', data);
      const { data: response } = await api.put(`/vitimas/${id}`, data);
      console.log('Vitima updated successfully:', response);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vitimas'] });
      queryClient.invalidateQueries({ queryKey: ['vitimas', data.casoId] });
      toast({
        title: "Vítima atualizada!",
        description: "A vítima foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
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
    mutationFn: async (id: string): Promise<void> => {
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
    onError: (error: any) => {
      console.error('Error deleting vitima:', error);
      toast({
        title: "Erro ao excluir vítima",
        description: error.response?.data?.message || "Ocorreu um erro ao excluir a vítima.",
        variant: "destructive",
      });
    },
  });
};
