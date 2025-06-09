
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
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      <Card  style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader >
          <Logo size="large" variant="dark"  />
          <CardTitle  style={{ color: '#123458' }}>
            Cadastro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            <View>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                
                required
              />
            </View>
            <View>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                
                required
              />
            </View>
            <View>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                
                required
              />
            </View>
            <View>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                
                required
              />
            </View>
            <Button
              type="submit"
              
              style={{ backgroundColor: '#123458' }}
            >
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </View>
  );
};

export default RegisterScreen;
