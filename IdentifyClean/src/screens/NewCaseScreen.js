import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigation } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera, Upload, Circle, Mic, MicOff, Play, Square } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DentalChart from '@/components/DentalChart';
import VictimManager from '@/components/VictimManager';
import LocationMap from '@/components/LocationMap';

interface ToothEvidence {
  toothNumber: number;
  image?: string;
  notes?: string;
}

interface Victim {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  notes?: string;
}

const NewCaseScreen = () => {
  const navigate = useNavigation();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [dentalEvidences, setDentalEvidences] = useState<ToothEvidence[]>([]);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioNote, setAudioNote] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    caseNumber: '',
    location: '',
    description: '',
    requestDate: '',
    priority: 'Normal',
    status: 'Em andamento'
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDentalEvidenceAdd = (evidence: ToothEvidence) => {
    setDentalEvidences(prev => {
      const existing = prev.find(e => e.toothNumber === evidence.toothNumber);
      if (existing) {
        return prev;
      }
      return [...prev, evidence];
    });
  };

  const handleDentalEvidenceRemove = (toothNumber: number) => {
    setDentalEvidences(prev => prev.filter(e => e.toothNumber !== toothNumber));
  };

  const handleDentalImageUpload = (toothNumber: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setDentalEvidences(prev => 
          prev.map(evidence => 
            evidence.toothNumber === toothNumber 
              ? { ...evidence, image: e.target!.result as string }
              : evidence
          )
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setAudioNote("Audio gravado com sucesso");
      toast({
        title: "Gravação finalizada",
        description: "Nota de áudio salva com sucesso."
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Gravação iniciada",
        description: "Fale sua observação sobre o caso."
      });
    }
  };

  const playAudioNote = () => {
    toast({
      title: "Reproduzindo áudio",
      description: "Reproduzindo nota de áudio gravada."
    });
  };

  const removeAudioNote = () => {
    setAudioNote(null);
    toast({
      title: "Áudio removido",
      description: "Nota de áudio foi removida."
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (victims.length === 0) {
      toast({
        title: "Erro de validação",
        description: "É necessário adicionar pelo menos uma vítima/paciente.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Caso criado com sucesso!",
        description: `Caso registrado com ${victims.length} vítima(s) e ${dentalEvidences.length} evidências dentárias.`
      });
      
      navigate('/cases');
    } catch (error) {
      toast({
        title: "Erro ao criar caso",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header com gradiente original */}
      <View >
        <View >
          <Button
            variant="ghost"
            size="icon"
            onPress={() => navigate('/cases')}
            
          >
            <ChevronLeft  />
          </Button>
          <View>
            <Text style={styles.title}>Novo Caso</Text>
            <Text>Registrar nova perícia</Text>
          </View>
        </View>
      </View>

      <View >
        {/* Card principal com design mais limpo */}
        <Card >
          <CardHeader >
            <CardTitle >
              <Circle  />
              Informações do Caso
            </CardTitle>
          </CardHeader>
          <CardContent >
            <form onSubmit={handleSubmit} >
              {/* Grid responsivo para campos principais */}
              <View >
                <View >
                  <Label htmlFor="caseNumber" >
                    Número do Caso
                  </Label>
                  <Input
                    id="caseNumber"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
                    placeholder="Ex: #6831121"
                    
                    required
                  />
                </View>

                <View >
                  <Label htmlFor="requestDate" >
                    Data de Solicitação
                  </Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
                    
                    required
                  />
                </View>
              </View>

              {/* Gerenciador de Vítimas com design neutro */}
              <Card >
                <CardHeader >
                  <CardTitle >Vítimas/Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <VictimManager
                    victims={victims}
                    onVictimsChange={setVictims}
                  />
                </CardContent>
              </Card>

              {/* Localização */}
              <Card >
                <CardHeader >
                  <CardTitle >
                    <MapPin  />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationMap
                    location={formData.location}
                    onLocationChange={(location) => setFormData({...formData, location})}
                  />
                </CardContent>
              </Card>

              {/* Status e Prioridade */}
              <View >
                <View >
                  <Label htmlFor="status" >Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Arquivado">Arquivado</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </View>

                <View >
                  <Label htmlFor="priority" >Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </View>
              </View>

              {/* Descrição com áudio */}
              <View >
                <Label htmlFor="description" >
                  Descrição do Caso
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva os detalhes do caso, objetivo da perícia, informações relevantes..."
                  
                  required
                />
                
                {/* Sistema de áudio com cores neutras */}
                <Card >
                  <View >
                    <Label >Nota de Áudio</Label>
                    <View >
                      <Button
                        type="button"
                        size="sm"
                        variant={isRecording ? "destructive" : "default"}
                        onPress={handleAudioRecord}
                        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}
                      >
                        {isRecording ? (
                          <>
                            <Square  />
                            Parar
                          </>
                        ) : (
                          <>
                            <Mic  />
                            Gravar
                          </>
                        )}
                      </Button>
                    </View>
                  </View>
                  
                  {audioNote && (
                    <View >
                      <span >Nota de áudio gravada</span>
                      <View >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onPress={playAudioNote}
                          
                        >
                          <Play  />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onPress={removeAudioNote}
                          
                        >
                          ×
                        </Button>
                      </View>
                    </View>
                  )}
                  
                  {isRecording && (
                    <View >
                      <View ></View>
                      <span >Gravando...</span>
                    </View>
                  )}
                </Card>
              </View>

              {/* Evidências Dentárias */}
              <Card >
                <CardHeader >
                  <CardTitle >
                    <Circle  />
                    Evidências Dentárias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DentalChart
                    evidences={dentalEvidences}
                    onEvidenceAdd={handleDentalEvidenceAdd}
                    onEvidenceRemove={handleDentalEvidenceRemove}
                    onImageUpload={handleDentalImageUpload}
                  />
                </CardContent>
              </Card>

              {/* Evidências Gerais */}
              <Card >
                <CardHeader >
                  <CardTitle >
                    <Camera  />
                    Evidências Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <View >
                    <TextInput
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      
                      id="file-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      
                      onPress={triggerFileInput}
                    >
                      <Upload  />
                      Adicionar Imagens
                    </Button>

                    {images.length > 0 && (
                      <View >
                        {images.map((image, index) => (
                          <View key={index} >
                            <img
                              src={image}
                              alt={`Evidência ${index + 1}`}
                              
                            />
                            <Button
                              type="button"
                              onPress={() => removeImage(index)}
                              size="icon"
                              variant="destructive"
                              
                            >
                              ×
                            </Button>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>

              {/* Botões de ação */}
              <View >
                <Button
                  type="button"
                  variant="outline"
                  onPress={() => navigate('/cases')}
                  
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  
                  style={{ backgroundColor: '#123458' }}
                >
                  {loading ? 'Criando...' : 'Criar Caso'}
                </Button>
              </View>
            </form>
          </CardContent>
        </Card>
      </View>
    </View>
  );
};

export default NewCaseScreen;
