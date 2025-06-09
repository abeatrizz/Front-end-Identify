
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useNavigation } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, UserCheck, UserX, Users, Activity } from 'lucide-react';
import Logo from '@/components/Logo';

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: 'admin' | 'perito' | 'assistente';
  active: boolean;
  lastLogin?: string;
  casesHandled?: number;
}

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

const AdminUsersScreen = () => {
  const navigate = useNavigation();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. João Silva',
      email: 'joao.silva@odontolegal.com',
      cpf: '12345678901',
      role: 'perito',
      active: true,
      lastLogin: '2024-01-15 14:30',
      casesHandled: 23
    },
    {
      id: '2',
      name: 'Dra. Maria Santos',
      email: 'maria.santos@odontolegal.com',
      cpf: '10987654321',
      role: 'perito',
      active: true,
      lastLogin: '2024-01-15 09:15',
      casesHandled: 18
    },
    {
      id: '3',
      name: 'Ana Oliveira',
      email: 'ana.oliveira@odontolegal.com',
      cpf: '11122233344',
      role: 'assistente',
      active: false,
      lastLogin: '2024-01-10 16:45',
      casesHandled: 5
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([
    {
      id: '1',
      action: 'Login',
      timestamp: '2024-01-15 14:30',
      details: 'Acesso ao sistema'
    },
    {
      id: '2',
      action: 'Caso Criado',
      timestamp: '2024-01-15 14:35',
      details: 'Caso #2024-001 - Perícia Odontológica'
    },
    {
      id: '3',
      action: 'Evidência Adicionada',
      timestamp: '2024-01-15 15:20',
      details: 'Caso #2024-001 - 3 imagens'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    cpf: '',
    role: 'perito' as 'admin' | 'perito' | 'assistente',
    password: ''
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      cpf: newUser.cpf,
      role: newUser.role,
      active: true,
      casesHandled: 0
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', cpf: '', role: 'perito', password: '' });
    setIsDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
    setIsEditDialogOpen(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const openEditDialog = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const openActivityDialog = (user: User) => {
    setSelectedUser(user);
    setIsActivityDialogOpen(true);
  };

  const activeUsers = users.filter(user => user.active);
  const inactiveUsers = users.filter(user => !user.active);

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <View >
        <View >
          <Button
            variant="ghost"
            size="icon"
            onPress={() => navigate('/profile')}
            
          >
            <ArrowLeft  />
          </Button>
          <Logo size="medium" variant="dark" />
        </View>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#123458' }}>
              <Plus  />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <View >
              <View>
                <Label htmlFor="new-name">Nome Completo</Label>
                <Input
                  id="new-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </View>
              <View>
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </View>
              <View>
                <Label htmlFor="new-cpf">CPF</Label>
                <Input
                  id="new-cpf"
                  value={newUser.cpf}
                  onChange={(e) => setNewUser({...newUser, cpf: e.target.value})}
                />
              </View>
              <View>
                <Label htmlFor="new-role">Função</Label>
                <select
                  id="new-role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'perito' | 'assistente'})}
                  
                >
                  <option value="perito">Perito</option>
                  <option value="assistente">Assistente</option>
                  <option value="admin">Administrador</option>
                </select>
              </View>
              <View>
                <Label htmlFor="new-password">Senha Inicial</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </View>
              <Button 
                onPress={handleCreateUser}
                style={{ backgroundColor: '#123458' }}
                
              >
                Criar Usuário
              </Button>
            </View>
          </DialogContent>
        </Dialog>
      </View>

      {/* Usuários Ativos */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader>
          <CardTitle  style={{ color: '#123458' }}>
            <UserCheck  />
            Usuários Ativos ({activeUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Casos</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'perito' ? 'Perito' : 'Assistente'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.casesHandled || 0}</TableCell>
                  <TableCell >{user.lastLogin}</TableCell>
                  <TableCell>
                    <View >
                      <Button 
                        size="sm" 
                        variant="outline"
                        onPress={() => openEditDialog(user)}
                      >
                        <Edit  />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onPress={() => openActivityDialog(user)}
                      >
                        <Activity  />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onPress={() => toggleUserStatus(user.id)}
                      >
                        <UserX  />
                      </Button>
                    </View>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Usuários Inativos */}
      <Card style={{ backgroundColor: '#D4C9BE' }}>
        <CardHeader>
          <CardTitle  style={{ color: '#123458' }}>
            <UserX  />
            Usuários Inativos ({inactiveUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell >{user.name}</TableCell>
                  <TableCell >{user.email}</TableCell>
                  <TableCell >
                    <Badge variant="secondary">
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'perito' ? 'Perito' : 'Assistente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onPress={() => toggleUserStatus(user.id)}
                    >
                      <UserCheck  />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <View >
              <View>
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </View>
              <View>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </View>
              <View>
                <Label htmlFor="edit-role">Função</Label>
                <select
                  id="edit-role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'perito' | 'assistente'})}
                  
                >
                  <option value="perito">Perito</option>
                  <option value="assistente">Assistente</option>
                  <option value="admin">Administrador</option>
                </select>
              </View>
              <View >
                <Button 
                  onPress={handleEditUser}
                  style={{ backgroundColor: '#123458' }}
                  
                >
                  Salvar
                </Button>
                <Button 
                  variant="outline"
                  onPress={() => setIsEditDialogOpen(false)}
                  
                >
                  Cancelar
                </Button>
              </View>
            </View>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Atividades */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Movimentações de {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <View >
            <View >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Badge variant="outline">{activity.action}</Badge>
                      </TableCell>
                      <TableCell >{activity.timestamp}</TableCell>
                      <TableCell >{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </View>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default AdminUsersScreen;
