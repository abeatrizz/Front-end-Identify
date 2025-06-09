
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigation } from 'react-router-dom';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { useCases, useDeleteCase } from '@/hooks/useApiCases';

const CasesScreen = () => {
  const navigate = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  const { data: cases = [], isLoading, error } = useCases();
  const deleteCase = useDeleteCase();

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_._id.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Arquivado': return 'bg-gray-100 text-gray-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este caso?')) {
      deleteCase.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <View  style={{ backgroundColor: '#f5f5f0' }}>
        <View >
          <Text>Carregando casos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View  style={{ backgroundColor: '#f5f5f0' }}>
        <View >
          <Text>Erro ao carregar casos. Tente novamente.</Text>
        </View>
      </View>
    );
  }

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <View >
        <Logo size="medium" variant="dark" />
        <Button 
          onPress={() => navigate('/new-case')}
          
          style={{ backgroundColor: '#123458' }}
        >
          <Plus  />
          Novo Caso
        </Button>
      </View>

      {/* Search and Filter */}
      <View >
        <View >
          <Search  />
          <Input
            placeholder="Buscar casos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            
          />
        </View>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger >
            <Filter  style={{ color: '#123458' }} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </View>

      {/* Cases List */}
      <View >
        {filteredCases.map((case_) => (
          <Card 
            key={case_._id}
            
            style={{ backgroundColor: '#D4C9BE' }}
          >
            <CardContent >
              <View >
                <View >
                  <View >
                    <Text style={styles.title}>Caso #{case_._id.slice(-6)}</Text>
                    <Badge className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </View>
                  <Text>{case_.titulo}</Text>
                </View>
                <View >
                  <Button
                    size="icon"
                    variant="ghost"
                    
                    onPress={() => navigate(`/cases/${case_._id}`)}
                  >
                    <Edit  />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    
                    onPress={() => handleDeleteCase(case_._id)}
                    disabled={deleteCase.isPending}
                  >
                    <Trash2  />
                  </Button>
                </View>
              </View>
              
              <View >
                <Text>{case_.descricao}</Text>
              </View>

              <View >
                <View >
                  <span>Data: {formatDate(case_.dataAbertura)}</span>
                </View>
                <Button
                  variant="link"
                  
                  onPress={() => navigate(`/cases/${case_._id}`)}
                >
                  Ver detalhes
                </Button>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {filteredCases.length === 0 && (
        <View >
          <Text>Nenhum caso encontrado</Text>
        </View>
      )}
    </View>
  );
};

export default CasesScreen;
