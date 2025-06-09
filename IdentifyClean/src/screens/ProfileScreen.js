
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from 'react-router-dom';
import { ArrowLeft, User, Settings, Users, Camera, Key } from 'lucide-react';
import Logo from '@/components/Logo';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    profileImage: user?.profileImage || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    // Implementar lógica de salvar perfil
    console.log('Salvando perfil:', formData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não conferem!');
      return;
    }
    // Implementar lógica de alterar senha
    console.log('Alterando senha');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, profileImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <View >
        <View >
          <Button
            variant="ghost"
            size="icon"
            onPress={() => navigate('/dashboard')}
            
          >
            <ArrowLeft  />
          </Button>
          <Logo size="medium" variant="dark" />
        </View>
      </View>

      {/* Perfil do Usuário */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader>
          <CardTitle  style={{ color: '#123458' }}>
            <User  />
            Meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent >
          {/* Foto de Perfil */}
          <View >
            <Avatar >
              <AvatarImage src={formData.profileImage} />
              <AvatarFallback style={{ backgroundColor: '#123458', color: 'white' }}>
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <View>
                <TextInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  
                  id="profile-image"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => document.getElementById('profile-image')?.click()}
                >
                  <Camera  />
                  Alterar Foto
                </Button>
              </View>
            )}
          </View>

          <View>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={!isEditing}
              
            />
          </View>
          <View>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={!isEditing}
              
            />
          </View>
          <View>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              value={formData.cpf}
              disabled={true}
              
            />
          </View>
          <View>
            <Label htmlFor="role">Função</Label>
            <Input
              id="role"
              type="text"
              value={user?.role === 'admin' ? 'Administrador' : user?.role === 'perito' ? 'Perito' : 'Assistente'}
              disabled={true}
              
            />
          </View>
          <View >
            {!isEditing ? (
              <Button
                onPress={() => setIsEditing(true)}
                style={{ backgroundColor: '#123458' }}
              >
                <Settings  />
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button
                  onPress={handleSave}
                  style={{ backgroundColor: '#123458' }}
                >
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Alteração de Senha */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader>
          <CardTitle  style={{ color: '#123458' }}>
            <Key  />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent >
          {!isChangingPassword ? (
            <Button
              onPress={() => setIsChangingPassword(true)}
              variant="outline"
              style={{ borderColor: '#123458', color: '#123458' }}
            >
              Alterar Senha
            </Button>
          ) : (
            <>
              <View>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  
                />
              </View>
              <View>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  
                />
              </View>
              <View>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  
                />
              </View>
              <View >
                <Button
                  onPress={handlePasswordChange}
                  style={{ backgroundColor: '#123458' }}
                >
                  Salvar Senha
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setIsChangingPassword(false)}
                >
                  Cancelar
                </Button>
              </View>
            </>
          )}
        </CardContent>
      </Card>

      {/* Gerenciamento de Usuários (apenas para admin) */}
      {user?.role === 'admin' && (
        <Card style={{ backgroundColor: '#D4C9BE' }}>
          <CardHeader>
            <CardTitle  style={{ color: '#123458' }}>
              <Users  />
              Gerenciamento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onPress={() => navigate('/admin/users')}
              style={{ backgroundColor: '#123458' }}
              
            >
              Gerenciar Usuários
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardContent >
          <Button
            onPress={handleLogout}
            variant="destructive"
            
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

export default ProfileScreen;
