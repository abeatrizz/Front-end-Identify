
import React, { createContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import api, { webStorage } from '@/services/api';
import { LoginRequest, LoginResponse } from '@/types/api';

interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  role: 'admin' | 'perito' | 'assistente';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { value: token } = await webStorage.get({ key: 'auth_token' });
      const { value: userData } = await webStorage.get({ key: 'user_data' });
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const loginData: LoginRequest = { email, password };
      const { data }: { data: LoginResponse } = await api.post('/auth/login', loginData);
      
      const mappedUser: User = {
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: 'perito', // Default role, você pode ajustar conforme necessário
      };
      
      await webStorage.set({ key: 'auth_token', value: data.token });
      await webStorage.set({ key: 'user_data', value: JSON.stringify(mappedUser) });
      
      setUser(mappedUser);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${mappedUser.name}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Email ou senha incorretos';
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await webStorage.remove({ key: 'auth_token' });
      await webStorage.remove({ key: 'user_data' });
      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
