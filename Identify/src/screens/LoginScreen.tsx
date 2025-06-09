
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f0' }}>
      <Card className="w-full max-w-md" style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="large" variant="dark" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{ backgroundColor: '#123458' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
