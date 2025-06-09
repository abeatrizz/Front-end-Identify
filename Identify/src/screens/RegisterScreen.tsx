
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de registro
    console.log('Register form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f0' }}>
      <Card className="w-full max-w-md" style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader className="text-center">
          <Logo size="large" variant="dark" className="mb-2" />
          <CardTitle className="text-xl font-bold" style={{ color: '#123458' }}>
            Cadastro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                className="bg-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#123458' }}
            >
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterScreen;
