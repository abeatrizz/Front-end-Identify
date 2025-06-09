
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Save, Clock, User } from 'lucide-react';

interface Annotation {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type: 'observation' | 'analysis' | 'note';
}

interface EvidenceAnnotationsProps {
  evidenceId: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  disabled?: boolean;
}

const EvidenceAnnotations: React.FC<EvidenceAnnotationsProps> = ({
  evidenceId,
  annotations,
  onAnnotationsChange,
  disabled = false
}) => {
  const [newAnnotation, setNewAnnotation] = useState('');
  const [annotationType, setAnnotationType] = useState<'observation' | 'analysis' | 'note'>('observation');

  const addAnnotation = () => {
    if (!newAnnotation.trim()) return;

    const annotation: Annotation = {
      id: Date.now().toString(),
      text: newAnnotation.trim(),
      author: 'Usuário Atual', // Substituir pelo usuário logado
      timestamp: new Date().toLocaleString('pt-BR'),
      type: annotationType
    };

    onAnnotationsChange([...annotations, annotation]);
    setNewAnnotation('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'observation': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-green-100 text-green-800';
      case 'note': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'observation': return 'Observação';
      case 'analysis': return 'Análise';
      case 'note': return 'Nota';
      default: return 'Anotação';
    }
  };

  return (
    <Card >
      <CardHeader >
        <CardTitle >
          <PenTool  />
          Anotações da Evidência
        </CardTitle>
      </CardHeader>
      <CardContent >
        {/* Lista de anotações existentes */}
        {annotations.length > 0 && (
          <View >
            {annotations.map((annotation) => (
              <View key={annotation.id} >
                <View >
                  <Badge className={getTypeColor(annotation.type)}>
                    {getTypeLabel(annotation.type)}
                  </Badge>
                  <View >
                    <User  />
                    <span>{annotation.author}</span>
                    <Clock  />
                    <span>{annotation.timestamp}</span>
                  </View>
                </View>
                <Text>{annotation.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Formulário para nova anotação */}
        {!disabled && (
          <View >
            <View >
              {(['observation', 'analysis', 'note'] as const).map((type) => (
                <Button
                  key={type}
                  type="button"
                  size="sm"
                  variant={annotationType === type ? "default" : "outline"}
                  onPress={() => setAnnotationType(type)}
                  
                >
                  {getTypeLabel(type)}
                </Button>
              ))}
            </View>
            <View>
              <Label htmlFor="new-annotation" >Nova Anotação</Label>
              <Textarea
                id="new-annotation"
                placeholder="Digite sua anotação..."
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                
              />
            </View>
            <Button
              type="button"
              onPress={addAnnotation}
              disabled={!newAnnotation.trim()}
              size="sm"
              
              style={{ backgroundColor: '#123458' }}
            >
              <Save  />
              Salvar Anotação
            </Button>
          </View>
        )}

        {annotations.length === 0 && (
          <Text>
            Nenhuma anotação adicionada ainda
          </Text>
        )}
      </CardContent>
    </Card>
  );
};

export default EvidenceAnnotations;
