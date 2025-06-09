
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
    <View >
      <Label >
        <User  />
        Vítimas/Pacientes
      </Label>

      {/* Lista de vítimas existentes */}
      {victims.length > 0 && (
        <View >
          {victims.map((victim) => (
            <Card key={victim.id} >
              <CardContent >
                <View >
                  <View >
                    <View >
                      <Text style={styles.title}>{victim.name}</Text>
                      {victim.age && <Badge variant="outline">{victim.age} anos</Badge>}
                      {victim.gender && <Badge variant="outline">{victim.gender}</Badge>}
                    </View>
                    {victim.notes && (
                      <Text>{victim.notes}</Text>
                    )}
                  </View>
                  {!disabled && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      
                      onPress={() => removeVictim(victim.id)}
                    >
                      <X  />
                    </Button>
                  )}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      )}

      {/* Formulário para adicionar nova vítima */}
      {!disabled && (
        <Card >
          <CardContent >
            <View >
              <View >
                <View>
                  <Label htmlFor="victim-name" >Nome*</Label>
                  <Input
                    id="victim-name"
                    placeholder="Nome da vítima"
                    value={newVictim.name || ''}
                    onChange={(e) => setNewVictim({ ...newVictim, name: e.target.value })}
                    
                  />
                </View>
                <View>
                  <Label htmlFor="victim-age" >Idade</Label>
                  <Input
                    id="victim-age"
                    placeholder="Idade"
                    value={newVictim.age || ''}
                    onChange={(e) => setNewVictim({ ...newVictim, age: e.target.value })}
                    
                  />
                </View>
                <View>
                  <Label htmlFor="victim-gender" >Sexo</Label>
                  <Input
                    id="victim-gender"
                    placeholder="M/F"
                    value={newVictim.gender || ''}
                    onChange={(e) => setNewVictim({ ...newVictim, gender: e.target.value })}
                    
                  />
                </View>
              </View>
              <View>
                <Label htmlFor="victim-notes" >Observações</Label>
                <Input
                  id="victim-notes"
                  placeholder="Observações sobre a vítima"
                  value={newVictim.notes || ''}
                  onChange={(e) => setNewVictim({ ...newVictim, notes: e.target.value })}
                  
                />
              </View>
              <Button
                type="button"
                onPress={addVictim}
                disabled={!newVictim.name?.trim()}
                
                style={{ backgroundColor: '#123458' }}
              >
                <Plus  />
                Adicionar Vítima
              </Button>
            </View>
          </CardContent>
        </Card>
      )}
    </View>
  );
};

export default VictimManager;
