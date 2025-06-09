
import React, { useState } from 'react';
import { useNavigation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio de email
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <View  style={{ backgroundColor: '#f5f5f0' }}>
        <Card  style={{ backgroundColor: '#D4C9BE' }}>
          <CardHeader >
            <View >
              <Logo size="large" variant="dark" />
            </View>
          </CardHeader>
          <CardContent >
            <Text style={styles.title}>Email enviado!</Text>
            <Text>
              Enviamos um link para redefinir sua senha para o email informado.
            </Text>
            <Button
              onPress={() => navigate('/login')}
              style={{ backgroundColor: '#123458' }}
              
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      <Card  style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader >
          <View >
            <Button
              variant="ghost"
              size="icon"
              onPress={() => navigate('/login')}
              
            >
              <ArrowLeft  />
            </Button>
            <Logo size="large" variant="dark" />
            <View  />
          </View>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            <View >
              <Text style={styles.title}>Esqueci minha senha</Text>
              <Text>
                Digite seu email para receber um link de redefinição de senha
              </Text>
            </View>
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
            <Button
              type="submit"
              
              style={{ backgroundColor: '#123458' }}
            >
              Enviar link de redefinição
            </Button>
          </form>
        </CardContent>
      </Card>
    </View>
  );
};

export default ForgotPasswordScreen;
