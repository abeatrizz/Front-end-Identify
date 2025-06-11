import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
// import { RelatorioRequest, RelatorioResponse } from '@/types/api'; // Removido, pois o projeto é JS
import { toast } from '../config/toast';

export const useRelatorios = () => {
  return useQuery({
    queryKey: ['relatorios'],
    queryFn: async () => {
      console.log('Fetching relatorios...');
      const { data } = await api.get('/relatorios');
      console.log('Relatorios fetched successfully:', data);
      return data;
    },
  });
};

export const useCreateRelatorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (relatorioData) => {
      console.log('Creating relatorio with data:', relatorioData);
      const { data } = await api.post('/relatorios', relatorioData);
      console.log('Relatorio created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] });
      toast({
        title: "Relatório gerado!",
        description: "O relatório foi gerado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating relatorio:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: error.response?.data?.message || "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive",
      });
    },
  });
};
