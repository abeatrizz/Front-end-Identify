import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/usuarios');
      return data;
    },
  });
};
