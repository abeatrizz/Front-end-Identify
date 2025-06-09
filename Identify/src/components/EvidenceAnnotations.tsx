
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
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <PenTool className="w-4 h-4" />
          Anotações da Evidência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de anotações existentes */}
        {annotations.length > 0 && (
          <div className="space-y-3">
            {annotations.map((annotation) => (
              <div key={annotation.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getTypeColor(annotation.type)}>
                    {getTypeLabel(annotation.type)}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{annotation.author}</span>
                    <Clock className="w-3 h-3" />
                    <span>{annotation.timestamp}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-800">{annotation.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Formulário para nova anotação */}
        {!disabled && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex gap-2">
              {(['observation', 'analysis', 'note'] as const).map((type) => (
                <Button
                  key={type}
                  type="button"
                  size="sm"
                  variant={annotationType === type ? "default" : "outline"}
                  onClick={() => setAnnotationType(type)}
                  className="text-xs"
                >
                  {getTypeLabel(type)}
                </Button>
              ))}
            </div>
            <div>
              <Label htmlFor="new-annotation" className="text-sm">Nova Anotação</Label>
              <Textarea
                id="new-annotation"
                placeholder="Digite sua anotação..."
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                className="bg-white min-h-[80px]"
              />
            </div>
            <Button
              type="button"
              onClick={addAnnotation}
              disabled={!newAnnotation.trim()}
              size="sm"
              className="w-full flex items-center gap-2"
              style={{ backgroundColor: '#123458' }}
            >
              <Save className="w-4 h-4" />
              Salvar Anotação
            </Button>
          </div>
        )}

        {annotations.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma anotação adicionada ainda
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EvidenceAnnotations;
