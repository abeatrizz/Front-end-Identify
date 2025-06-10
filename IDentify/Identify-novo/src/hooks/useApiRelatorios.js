
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { RelatorioRequest, RelatorioResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useRelatorios = () => {
  return useQuery({
    queryKey: ['relatorios'],
    queryFn: async (): Promise<RelatorioResponse[]> => {
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
    mutationFn: async (relatorioData: RelatorioRequest): Promise<RelatorioResponse> => {
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
    onError: (error: any) => {
      console.error('Error creating relatorio:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: error.response?.data?.message || "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive",
      });
    },
  });
};
