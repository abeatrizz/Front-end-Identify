
import React, { useState } from 'react';
import { useNavigation } from 'react-router-dom';
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
  const navigate = useNavigation();

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
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      <Card  style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader >
          <View >
            <Logo size="large" variant="dark" />
          </View>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            <View>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                
              />
            </View>
            <View>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                
              />
            </View>
            <Button
              type="submit"
              
              disabled={loading}
              style={{ backgroundColor: '#123458' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <View >
              <TouchableOpacity
                type="button"
                onPress={handleForgotPassword}
                
              >
                Esqueci minha senha
              </TouchableOpacity>
            </View>
          </form>
        </CardContent>
      </Card>
    </View>
  );
};

export default LoginScreen;
