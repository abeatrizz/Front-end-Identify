
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import ToothIllustration from './ToothIllustration';

interface ToothEvidence {
  toothNumber: number;
  image?: string;
  notes?: string;
}

interface DentalChartProps {
  evidences: ToothEvidence[];
  onEvidenceAdd: (evidence: ToothEvidence) => void;
  onEvidenceRemove: (toothNumber: number) => void;
  onImageUpload: (toothNumber: number, file: File) => void;
  disabled?: boolean;
}

const DentalChart: React.FC<DentalChartProps> = ({
  evidences,
  onEvidenceAdd,
  onEvidenceRemove,
  onImageUpload,
  disabled = false
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Numeração padrão dos dentes (adulto)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const handleToothClick = (toothNumber: number) => {
    if (disabled) return;
    setSelectedTooth(toothNumber);
  };

  const handleAddEvidence = () => {
    if (!selectedTooth) return;
    
    onEvidenceAdd({
      toothNumber: selectedTooth,
      notes: notes.trim() || undefined
    });
    
    setSelectedTooth(null);
    setNotes('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedTooth) {
      onImageUpload(selectedTooth, file);
    }
  };

  const hasEvidence = (toothNumber: number) => {
    return evidences.some(e => e.toothNumber === toothNumber);
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle >Diagrama Dentário</CardTitle>
      </CardHeader>
      <CardContent >
        {/* Diagrama Superior */}
        <View>
          <Text>Arcada Superior</Text>
          <View >
            {upperTeeth.map(tooth => (
              <View key={tooth} >
                <ToothIllustration
                  toothNumber={tooth}
                  hasEvidence={hasEvidence(tooth)}
                  onPress={() => handleToothClick(tooth)}
                  size="sm"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Diagrama Inferior */}
        <View>
          <View >
            {lowerTeeth.map(tooth => (
              <View key={tooth} >
                <ToothIllustration
                  toothNumber={tooth}
                  hasEvidence={hasEvidence(tooth)}
                  onPress={() => handleToothClick(tooth)}
                  size="sm"
                />
              </View>
            ))}
          </View>
          <Text>Arcada Inferior</Text>
        </View>

        {/* Evidências Existentes */}
        {evidences.length > 0 && (
          <View >
            <Label >Evidências Registradas:</Label>
            <View >
              {evidences.map(evidence => (
                <View key={evidence.toothNumber} >
                  <span >Dente {evidence.toothNumber}</span>
                  {!disabled && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      
                      onPress={() => onEvidenceRemove(evidence.toothNumber)}
                    >
                      <X  />
                    </Button>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Formulário para dente selecionado */}
        {selectedTooth && !disabled && (
          <View >
            <Text style={styles.title}>Dente {selectedTooth} Selecionado</Text>
            
            <View>
              <Label htmlFor="tooth-notes" >Observações</Label>
              <Input
                id="tooth-notes"
                placeholder="Observações sobre este dente..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                
              />
            </View>

            <View>
              <Label >Imagem do Dente</Label>
              <TextInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                
                id={`tooth-image-${selectedTooth}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                
                onPress={() => document.getElementById(`tooth-image-${selectedTooth}`)?.click()}
              >
                <Upload  />
                Adicionar Imagem
              </Button>
            </View>

            <View >
              <Button
                type="button"
                size="sm"
                onPress={handleAddEvidence}
                
                style={{ backgroundColor: '#123458' }}
              >
                Adicionar Evidência
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onPress={() => setSelectedTooth(null)}
              >
                Cancelar
              </Button>
            </View>
          </View>
        )}

        {!disabled && (
          <Text>
            Clique em um dente para adicionar evidência
          </Text>
        )}
      </CardContent>
    </Card>
  );
};

export default DentalChart;
