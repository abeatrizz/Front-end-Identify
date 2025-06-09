
import React from 'react';
import { useNavigation, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Plus, FileText, BarChart3 } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigation();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'new-case',
      label: 'Novo caso',
      icon: Plus,
      path: '/new-case'
    },
    {
      id: 'cases',
      label: 'Casos',
      icon: FileText,
      path: '/cases'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3,
      path: '/reports'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/cases' && location.pathname.startsWith('/cases'));
  };

  return (
    <View 
      
      style={{ backgroundColor: '#D4C9BE' }}
    >
      <View >
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          return (
            <Button
              key={item.id}
              variant="ghost"
              onPress={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${
                active 
                  ? 'text-white' 
                  : 'hover:bg-blue-50'
              }`}
              style={{
                color: active ? 'white' : '#123458',
                backgroundColor: active ? '#123458' : 'transparent'
              }}
            >
              <IconComponent  />
              <span >{item.label}</span>
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
