
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <div className="p-4 pb-20 space-y-4" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/cases')}
          className="text-gray-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{caseData.title}</h1>
          <p className="text-sm text-gray-600">Caso #{caseData.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(caseData.status)}>
            {caseData.status}
          </Badge>
          {canEdit && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Case Info */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informações do Caso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-600">Perito:</span>
                <p className="font-medium">{caseData.perito}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-600">Data:</span>
                <p className="font-medium">{caseData.requestDate}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Descrição:</p>
            <div className="bg-white/50 rounded-lg p-3">
              <p className="text-sm">{caseData.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vítimas/Pacientes */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5" />
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
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {canAddEvidence && (
          <Button
            onClick={() => navigate(`/evidence/${id}`)}
            className="h-16 flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#123458' }}
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Capturar Evidências</span>
          </Button>
        )}
        
        <Button
          onClick={() => navigate('/reports')}
          variant="outline"
          className="h-16 flex flex-col items-center justify-center gap-2"
          style={{ borderColor: '#123458', color: '#123458' }}
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm">Ver Relatórios</span>
        </Button>

        <Button
          onClick={handleAIAnalysis}
          variant="outline"
          className="h-16 flex flex-col items-center justify-center gap-2"
          style={{ borderColor: '#123458', color: '#123458' }}
        >
          <Brain className="w-6 h-6" />
          <span className="text-sm">Análise IA</span>
        </Button>
      </div>

      {/* Evidence List */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Evidências ({caseData.evidences.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseData.evidences.map((evidence) => (
              <div key={evidence.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{evidence.description}</p>
                  <p className="text-sm text-gray-600">{evidence.type} • {evidence.date}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/evidence/${id}/${evidence.id}`)}
                >
                  Ver
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseDetailScreen;
