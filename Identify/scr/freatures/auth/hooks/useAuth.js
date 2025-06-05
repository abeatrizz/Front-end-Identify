import { useState, useCallback } from 'react';
import { loginApi } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await loginApi(email, password);
      return response.success || false;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading };
};