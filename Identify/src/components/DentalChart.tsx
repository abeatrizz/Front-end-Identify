
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
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-sm">Diagrama Dentário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Diagrama Superior */}
        <div>
          <p className="text-xs text-gray-600 mb-2 text-center">Arcada Superior</p>
          <div className="flex justify-center gap-1 mb-4">
            {upperTeeth.map(tooth => (
              <div key={tooth} className="relative">
                <ToothIllustration
                  toothNumber={tooth}
                  hasEvidence={hasEvidence(tooth)}
                  onClick={() => handleToothClick(tooth)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Diagrama Inferior */}
        <div>
          <div className="flex justify-center gap-1 mb-2">
            {lowerTeeth.map(tooth => (
              <div key={tooth} className="relative">
                <ToothIllustration
                  toothNumber={tooth}
                  hasEvidence={hasEvidence(tooth)}
                  onClick={() => handleToothClick(tooth)}
                  size="sm"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 text-center">Arcada Inferior</p>
        </div>

        {/* Evidências Existentes */}
        {evidences.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Evidências Registradas:</Label>
            <div className="grid grid-cols-2 gap-2">
              {evidences.map(evidence => (
                <div key={evidence.toothNumber} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Dente {evidence.toothNumber}</span>
                  {!disabled && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="w-4 h-4"
                      onClick={() => onEvidenceRemove(evidence.toothNumber)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário para dente selecionado */}
        {selectedTooth && !disabled && (
          <div className="p-3 bg-blue-50 rounded-lg space-y-3">
            <h4 className="font-medium text-blue-800">Dente {selectedTooth} Selecionado</h4>
            
            <div>
              <Label htmlFor="tooth-notes" className="text-sm">Observações</Label>
              <Input
                id="tooth-notes"
                placeholder="Observações sobre este dente..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label className="text-sm">Imagem do Dente</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id={`tooth-image-${selectedTooth}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-1"
                onClick={() => document.getElementById(`tooth-image-${selectedTooth}`)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Adicionar Imagem
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleAddEvidence}
                className="flex-1"
                style={{ backgroundColor: '#123458' }}
              >
                Adicionar Evidência
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedTooth(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {!disabled && (
          <p className="text-xs text-gray-500 text-center">
            Clique em um dente para adicionar evidência
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DentalChart;
