import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

export const useDashboard = (filters) => {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: async () => {
      console.log('Fetching dashboard data with filters:', filters);
      const params = filters ? new URLSearchParams(filters).toString() : '';
      const url = params ? `/dashboard?${params}` : '/dashboard';
      const { data } = await api.get(url);
      console.log('Dashboard data fetched successfully:', data);
      return data;
    },
  });
};
