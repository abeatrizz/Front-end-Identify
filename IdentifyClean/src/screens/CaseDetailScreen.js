
import React, { useState } from 'react';
import { useParams, useNavigation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Camera, FileText, User, Calendar, MapPin, Edit, Brain } from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import VictimManager from '@/components/VictimManager';

interface Victim {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  notes?: string;
}

const CaseDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [victims, setVictims] = useState<Victim[]>([
    {
      id: '1',
      name: 'João da Silva',
      age: '45',
      gender: 'M',
      notes: 'Paciente principal'
    }
  ]);

  // Mock data - substituir por dados reais da API
  const caseData = {
    id: id,
    title: 'Análise Dental - Paciente A',
    status: 'Em andamento',
    patient: 'João da Silva',
    perito: 'Dr. João Silva',
    requestDate: '2024-01-15',
    location: 'Clínica Odontológica Central - Rua das Flores, 123',
    description: 'Análise comparativa de registros dentários para identificação pericial.',
    evidences: [
      { id: 1, type: 'Foto', description: 'Radiografia panorâmica', date: '2024-01-15' },
      { id: 2, type: 'Foto', description: 'Foto intraoral', date: '2024-01-15' },
      { id: 3, type: 'Documento', description: 'Ficha dentária', date: '2024-01-14' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Arquivado': return 'bg-gray-100 text-gray-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = caseData.status === 'Em andamento';
  const canAddEvidence = caseData.status === 'Em andamento';

  const handleAIAnalysis = () => {
    // Implementar análise de IA
    console.log('Iniciando análise completa de IA...');
    navigate(`/cases/${id}/ai-analysis`);
  };

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <View >
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigate('/cases')}
          
        >
          <ChevronLeft  />
        </Button>
        <View >
          <Text style={styles.title}>{caseData.title}</Text>
          <Text>Caso #{caseData.id}</Text>
        </View>
        <View >
          <Badge className={getStatusColor(caseData.status)}>
            {caseData.status}
          </Badge>
          {canEdit && (
            <Button
              size="icon"
              variant="outline"
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit  />
            </Button>
          )}
        </View>
      </View>

      {/* Case Info */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >
            <FileText  />
            Informações do Caso
          </CardTitle>
        </CardHeader>
        <CardContent >
          <View >
            <View >
              <User  />
              <View>
                <span >Perito:</span>
                <Text>{caseData.perito}</Text>
              </View>
            </View>
            <View >
              <Calendar  />
              <View>
                <span >Data:</span>
                <Text>{caseData.requestDate}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text>Descrição:</Text>
            <View >
              <Text>{caseData.description}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Vítimas/Pacientes */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >
            <User  />
            Vítimas/Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VictimManager
            victims={victims}
            onVictimsChange={setVictims}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Localização */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >
            <MapPin  />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocationMap
            location={caseData.location}
            readonly={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <View >
        {canAddEvidence && (
          <Button
            onPress={() => navigate(`/evidence/${id}`)}
            
            style={{ backgroundColor: '#123458' }}
          >
            <Camera  />
            <span >Capturar Evidências</span>
          </Button>
        )}
        
        <Button
          onPress={() => navigate('/reports')}
          variant="outline"
          
          style={{ borderColor: '#123458', color: '#123458' }}
        >
          <FileText  />
          <span >Ver Relatórios</span>
        </Button>

        <Button
          onPress={handleAIAnalysis}
          variant="outline"
          
          style={{ borderColor: '#123458', color: '#123458' }}
        >
          <Brain  />
          <span >Análise IA</span>
        </Button>
      </View>

      {/* Evidence List */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >
            <Camera  />
            Evidências ({caseData.evidences.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View >
            {caseData.evidences.map((evidence) => (
              <View key={evidence.id} >
                <View >
                  <Text>{evidence.description}</Text>
                  <Text>{evidence.type} • {evidence.date}</Text>
                </View>
                <Button 
                  size="sm" 
                  variant="outline"
                  onPress={() => navigate(`/evidence/${id}/${evidence.id}`)}
                >
                  Ver
                </Button>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default CaseDetailScreen;
