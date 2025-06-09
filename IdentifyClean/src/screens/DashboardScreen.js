
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Logo from '@/components/Logo';

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigation();

  // Dados para o gráfico de status de casos
  const statusData = [
    { name: 'Em andamento', value: 60, color: '#123458' },
    { name: 'Concluídos', value: 40, color: '#F59E0B' },
    { name: 'Arquivados', value: 40, color: '#EF4444' }
  ];

  // Dados para o gráfico de total de casos por mês
  const monthlyData = [
    { month: 'Dezembro', cases: 120 },
    { month: 'Janeiro', cases: 110 },
    { month: 'Fevereiro', cases: 90 },
    { month: 'Março', cases: 125 },
    { month: 'Abril', cases: 111 }
  ];

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header com Logo */}
      <View >
        <Logo size="large" variant="dark" />
        <View >
          <View >
            <Text>Bem-vindo</Text>
            <Text>{user?.name}</Text>
          </View>
          <Avatar 
            
            onPress={() => navigate('/profile')}
          >
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback style={{ backgroundColor: '#123458', color: 'white' }}>
              {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </View>
      </View>

      {/* Gráfico de Status de Casos */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader >
          <CardTitle >Status de casos</CardTitle>
          <Text>Abril</Text>
        </CardHeader>
        <CardContent >
          <View >
            <View >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </View>
            <View >
              {statusData.map((item, index) => (
                <View key={index} >
                  <View 
                     
                    style={{ backgroundColor: item.color }}
                  />
                  <span >
                    {item.value}% {item.name.toLowerCase()}
                  </span>
                </View>
              ))}
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Gráfico de Total de Casos */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader >
          <CardTitle >Total de casos</CardTitle>
        </CardHeader>
        <CardContent >
          <View >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="cases" 
                  fill="#123458" 
                  radius={[4, 4, 0, 0]}
                  label={{ position: 'top', fontSize: 12, fill: '#374151' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </View>
        </CardContent>
      </Card>

      {/* Stats Resumo */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >Resumo</CardTitle>
        </CardHeader>
        <CardContent >
          <View>
            <Text>12</Text>
            <Text>Casos Ativos</Text>
          </View>
          <View>
            <Text>45</Text>
            <Text>Evidências</Text>
          </View>
          <View>
            <Text>8</Text>
            <Text>Laudos</Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default DashboardScreen;
