import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header com gradiente original */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cases')}
            className="text-white hover:bg-white/20 w-10 h-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Novo Caso</h1>
            <p className="text-gray-300 text-sm">Registrar nova perícia</p>
          </div>
        </div>
      </div>

      <div className="p-4 pb-24 space-y-6">
        {/* Card principal com design mais limpo */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Circle className="w-5 h-5" />
              Informações do Caso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid responsivo para campos principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseNumber" className="text-sm font-semibold text-gray-700">
                    Número do Caso
                  </Label>
                  <Input
                    id="caseNumber"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
                    placeholder="Ex: #6831121"
                    className="bg-white border-gray-200 focus:border-gray-400 rounded-lg h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestDate" className="text-sm font-semibold text-gray-700">
                    Data de Solicitação
                  </Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
                    className="bg-white border-gray-200 focus:border-gray-400 rounded-lg h-12"
                    required
                  />
                </div>
              </div>

              {/* Gerenciador de Vítimas com design neutro */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-800 text-lg">Vítimas/Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <VictimManager
                    victims={victims}
                    onVictimsChange={setVictims}
                  />
                </CardContent>
              </Card>

              {/* Localização */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="bg-white border-gray-200 h-12 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Arquivado">Arquivado</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger className="bg-white border-gray-200 h-12 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descrição com áudio */}
              <div className="space-y-4">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Descrição do Caso
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva os detalhes do caso, objetivo da perícia, informações relevantes..."
                  className="bg-white border-gray-200 focus:border-gray-400 rounded-lg min-h-[120px]"
                  required
                />
                
                {/* Sistema de áudio com cores neutras */}
                <Card className="bg-gray-50 border border-gray-300 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-gray-700 font-semibold">Nota de Áudio</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={isRecording ? "destructive" : "default"}
                        onClick={handleAudioRecord}
                        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4 mr-1" />
                            Parar
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-1" />
                            Gravar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {audioNote && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600">Nota de áudio gravada</span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={playAudioNote}
                          className="border-gray-300"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={removeAudioNote}
                          className="border-gray-300"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Gravando...</span>
                    </div>
                  )}
                </Card>
              </div>

              {/* Evidências Dentárias */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Circle className="w-5 h-5" />
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
              <Card className="bg-gray-50 border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Camera className="w-5 h-5" />
                    Evidências Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="file-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={triggerFileInput}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Adicionar Imagens
                    </Button>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Evidência ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg bg-white border border-gray-200 shadow-sm"
                            />
                            <Button
                              type="button"
                              onClick={() => removeImage(index)}
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 w-6 h-6 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/cases')}
                  className="flex-1 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 text-white font-semibold"
                  style={{ backgroundColor: '#123458' }}
                >
                  {loading ? 'Criando...' : 'Criar Caso'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewCaseScreen;
