
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { OdontologiaRequest, OdontologiaResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useOdontologia = () => {
  return useQuery({
    queryKey: ['odontologia'],
    queryFn: async (): Promise<OdontologiaResponse[]> => {
      console.log('Fetching odontologia...');
      const { data } = await api.get('/odontologia');
      console.log('Odontologia fetched successfully:', data);
      return data;
    },
  });
};

export const useCreateOdontologia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (odontologiaData: OdontologiaRequest): Promise<OdontologiaResponse> => {
      console.log('Creating odontologia with data:', odontologiaData);
      const { data } = await api.post('/odontologia', odontologiaData);
      console.log('Odontologia created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odontologia'] });
      toast({
        title: "Registro odontológico criado!",
        description: "O registro foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating odontologia:', error);
      toast({
        title: "Erro ao criar registro",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o registro odontológico.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOdontologia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OdontologiaRequest> }): Promise<OdontologiaResponse> => {
      console.log('Updating odontologia:', id, 'with data:', data);
      const { data: response } = await api.put(`/odontologia/${id}`, data);
      console.log('Odontologia updated successfully:', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odontologia'] });
      toast({
        title: "Registro atualizado!",
        description: "O registro odontológico foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating odontologia:', error);
      toast({
        title: "Erro ao atualizar registro",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o registro.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOdontologia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting odontologia:', id);
      await api.delete(`/odontologia/${id}`);
      console.log('Odontologia deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odontologia'] });
      toast({
        title: "Registro excluído!",
        description: "O registro odontológico foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting odontologia:', error);
      toast({
        title: "Erro ao excluir registro",
        description: error.response?.data?.message || "Ocorreu um erro ao excluir o registro.",
        variant: "destructive",
      });
    },
  });
};
