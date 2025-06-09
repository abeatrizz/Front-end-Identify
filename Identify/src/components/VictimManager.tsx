
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, User } from 'lucide-react';

interface Victim {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  notes?: string;
}

interface VictimManagerProps {
  victims: Victim[];
  onVictimsChange: (victims: Victim[]) => void;
  disabled?: boolean;
}

const VictimManager: React.FC<VictimManagerProps> = ({ victims, onVictimsChange, disabled = false }) => {
  const [newVictim, setNewVictim] = useState<Partial<Victim>>({
    name: '',
    age: '',
    gender: '',
    notes: ''
  });

  const addVictim = () => {
    if (!newVictim.name?.trim()) return;
    
    const victim: Victim = {
      id: Date.now().toString(),
      name: newVictim.name.trim(),
      age: newVictim.age?.trim(),
      gender: newVictim.gender?.trim(),
      notes: newVictim.notes?.trim()
    };
    
    onVictimsChange([...victims, victim]);
    setNewVictim({ name: '', age: '', gender: '', notes: '' });
  };

  const removeVictim = (id: string) => {
    onVictimsChange(victims.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <User className="w-4 h-4" />
        Vítimas/Pacientes
      </Label>

      {/* Lista de vítimas existentes */}
      {victims.length > 0 && (
        <div className="space-y-2">
          {victims.map((victim) => (
            <Card key={victim.id} className="bg-white">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{victim.name}</h4>
                      {victim.age && <Badge variant="outline">{victim.age} anos</Badge>}
                      {victim.gender && <Badge variant="outline">{victim.gender}</Badge>}
                    </div>
                    {victim.notes && (
                      <p className="text-sm text-gray-600">{victim.notes}</p>
                    )}
                  </div>
                  {!disabled && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 text-gray-500 hover:text-red-600"
                      onClick={() => removeVictim(victim.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulário para adicionar nova vítima */}
      {!disabled && (
        <Card className="bg-white border-dashed">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="victim-name" className="text-sm">Nome*</Label>
                  <Input
                    id="victim-name"
                    placeholder="Nome da vítima"
                    value={newVictim.name || ''}
                    onChange={(e) => setNewVictim({ ...newVictim, name: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="victim-age" className="text-sm">Idade</Label>
                  <Input
                    id="victim-age"
                    placeholder="Idade"
                    value={newVictim.age || ''}
                    onChange={(e) => setNewVictim({ ...newVictim, age: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="victim-gender" className="text-sm">Sexo</Label>
                  <Input
                    id="victim-gender"
                    placeholder="M/F"
                    value={newVictim.gender || ''}
                    onChange={(e) => setNewVictim({ ...newVictim, gender: e.target.value })}
                    className="bg-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="victim-notes" className="text-sm">Observações</Label>
                <Input
                  id="victim-notes"
                  placeholder="Observações sobre a vítima"
                  value={newVictim.notes || ''}
                  onChange={(e) => setNewVictim({ ...newVictim, notes: e.target.value })}
                  className="bg-white"
                />
              </div>
              <Button
                type="button"
                onClick={addVictim}
                disabled={!newVictim.name?.trim()}
                className="w-full flex items-center gap-2"
                style={{ backgroundColor: '#123458' }}
              >
                <Plus className="w-4 h-4" />
                Adicionar Vítima
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VictimManager;
