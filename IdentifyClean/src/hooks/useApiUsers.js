
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { UserResponse } from '@/types/api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserResponse[]> => {
      const { data } = await api.get('/usuarios');
      return data;
    },
  });
};
