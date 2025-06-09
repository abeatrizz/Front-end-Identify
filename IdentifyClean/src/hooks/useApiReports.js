
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { ReportRequest, ReportResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async (): Promise<ReportResponse[]> => {
      const { data } = await api.get('/relatorios');
      return data;
    },
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reportData: ReportRequest): Promise<ReportResponse> => {
      const { data } = await api.post('/relatorios', reportData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Relatório gerado!",
        description: "O relatório foi criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive",
      });
    },
  });
};
