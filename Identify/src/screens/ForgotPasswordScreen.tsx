
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio de email
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f0' }}>
        <Card className="w-full max-w-md" style={{ backgroundColor: '#D4C9BE' }}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="large" variant="dark" />
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Email enviado!</h2>
            <p className="text-gray-600">
              Enviamos um link para redefinir sua senha para o email informado.
            </p>
            <Button
              onClick={() => navigate('/login')}
              style={{ backgroundColor: '#123458' }}
              className="w-full"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f0' }}>
      <Card className="w-full max-w-md" style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo size="large" variant="dark" />
            <div className="w-10" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Esqueci minha senha</h2>
              <p className="text-sm text-gray-600 mt-2">
                Digite seu email para receber um link de redefinição de senha
              </p>
            </div>
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
            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#123458' }}
            >
              Enviar link de redefinição
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordScreen;
