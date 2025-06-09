
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Logo from '@/components/Logo';

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="p-4 pb-20 space-y-4" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header com Logo */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
        <Logo size="large" variant="dark" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Bem-vindo</p>
            <p className="font-semibold text-gray-800">{user?.name}</p>
          </div>
          <Avatar 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/profile')}
          >
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback style={{ backgroundColor: '#123458', color: 'white' }}>
              {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Gráfico de Status de Casos */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-center">Status de casos</CardTitle>
          <p className="text-sm text-gray-600 text-center">Abril</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="w-32 h-32">
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
            </div>
            <div className="flex flex-col space-y-2 flex-1 ml-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.value}% {item.name.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Total de Casos */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-center">Total de casos</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Stats Resumo */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Resumo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-sm text-gray-600">Casos Ativos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">45</p>
            <p className="text-sm text-gray-600">Evidências</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">8</p>
            <p className="text-sm text-gray-600">Laudos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardScreen;
