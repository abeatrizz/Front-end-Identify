
import React, { useState } from 'react';
import { useParams, useNavigation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Camera, FileText, Brain, Download, Edit } from 'lucide-react';
import EvidenceAnnotations from '@/components/EvidenceAnnotations';

interface Annotation {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type: 'observation' | 'analysis' | 'note';
}

const EvidenceDetailScreen = () => {
  const { caseId } = useParams();
  const navigate = useNavigation();
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      text: 'Evidência coletada em bom estado de conservação.',
      author: 'Dr. João Silva',
      timestamp: '15/01/2024 14:30',
      type: 'observation'
    },
    {
      id: '2',
      text: 'Análise inicial sugere compatibilidade com padrão dentário registrado.',
      author: 'Dr. João Silva',
      timestamp: '15/01/2024 15:45',
      type: 'analysis'
    }
  ]);

  // Mock data - substituir por dados reais da API
  const evidenceData = {
    id: '1',
    caseId: caseId,
    title: 'Radiografia Panorâmica',
    type: 'Imagem Radiográfica',
    captureDate: '2024-01-15',
    location: 'Clínica Odontológica Central',
    imageUrl: '/api/placeholder/400/300',
    description: 'Radiografia panorâmica completa da arcada dentária.',
    aiAnalysis: {
      completed: true,
      confidence: 0.87,
      findings: [
        'Padrão dentário único identificado',
        'Estruturas ósseas preservadas',
        'Marcadores anatômicos claros'
      ]
    }
  };

  const handleAIAnalysis = () => {
    // Implementar análise de IA
    console.log('Iniciando análise de IA...');
  };

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <View >
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigate(`/cases/${caseId}`)}
          
        >
          <ChevronLeft  />
        </Button>
        <View >
          <Text style={styles.title}>{evidenceData.title}</Text>
          <Text>Caso #{evidenceData.caseId}</Text>
        </View>
        <Badge variant="secondary">{evidenceData.type}</Badge>
      </View>

      {/* Imagem da Evidência */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardContent >
          <View >
            <img
              src={evidenceData.imageUrl}
              alt={evidenceData.title}
              
            />
          </View>
          <View >
            <Button
              variant="outline"
              size="sm"
              
            >
              <Download  />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              
            >
              <Edit  />
              Editar
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Informações da Evidência */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >
            <FileText  />
            Detalhes da Evidência
          </CardTitle>
        </CardHeader>
        <CardContent >
          <View >
            <View>
              <span >Data de Captura:</span>
              <Text>{evidenceData.captureDate}</Text>
            </View>
            <View>
              <span >Local:</span>
              <Text>{evidenceData.location}</Text>
            </View>
          </View>
          <View>
            <span >Descrição:</span>
            <View >
              <Text>{evidenceData.description}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Análise de IA */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >
            <Brain  />
            Análise de IA
          </CardTitle>
        </CardHeader>
        <CardContent >
          {evidenceData.aiAnalysis.completed ? (
            <View>
              <View >
                <Badge >
                  Análise Concluída
                </Badge>
                <span >
                  Confiança: {(evidenceData.aiAnalysis.confidence * 100).toFixed(0)}%
                </span>
              </View>
              <View >
                <Text style={styles.title}>Principais Achados:</Text>
                <ul >
                  {evidenceData.aiAnalysis.findings.map((finding, index) => (
                    <li key={index} >
                      <span ></span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </View>
            </View>
          ) : (
            <View >
              <Text>Análise de IA não executada</Text>
              <Button
                onPress={handleAIAnalysis}
                
                style={{ backgroundColor: '#123458' }}
              >
                <Brain  />
                Executar Análise de IA
              </Button>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Anotações */}
      <EvidenceAnnotations
        evidenceId={evidenceData.id}
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
      />
    </View>
  );
};

export default EvidenceDetailScreen;
