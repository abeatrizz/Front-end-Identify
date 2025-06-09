
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, Users, Camera, Key } from 'lucide-react';
import Logo from '@/components/Logo';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    <div className="p-4 pb-20 space-y-4" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo size="medium" variant="dark" />
        </div>
      </div>

      {/* Perfil do Usuário */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#123458' }}>
            <User className="h-5 w-5" />
            Meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.profileImage} />
              <AvatarFallback style={{ backgroundColor: '#123458', color: 'white' }}>
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profile-image')?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Alterar Foto
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={!isEditing}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={!isEditing}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              value={formData.cpf}
              disabled={true}
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="role">Função</Label>
            <Input
              id="role"
              type="text"
              value={user?.role === 'admin' ? 'Administrador' : user?.role === 'perito' ? 'Perito' : 'Assistente'}
              disabled={true}
              className="bg-gray-100"
            />
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: '#123458' }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  style={{ backgroundColor: '#123458' }}
                >
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alteração de Senha */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#123458' }}>
            <Key className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isChangingPassword ? (
            <Button
              onClick={() => setIsChangingPassword(true)}
              variant="outline"
              style={{ borderColor: '#123458', color: '#123458' }}
            >
              Alterar Senha
            </Button>
          ) : (
            <>
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePasswordChange}
                  style={{ backgroundColor: '#123458' }}
                >
                  Salvar Senha
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(false)}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Gerenciamento de Usuários (apenas para admin) */}
      {user?.role === 'admin' && (
        <Card style={{ backgroundColor: '#D4C9BE' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#123458' }}>
              <Users className="h-5 w-5" />
              Gerenciamento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/admin/users')}
              style={{ backgroundColor: '#123458' }}
              className="w-full"
            >
              Gerenciar Usuários
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardContent className="pt-6">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileScreen;
