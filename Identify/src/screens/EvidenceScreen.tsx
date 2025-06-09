import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Camera, Upload, AlertCircle } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from '@/hooks/use-toast';

const EvidenceScreen = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data do caso - em produção, buscar da API
  const caseStatus = 'Em andamento'; // 'Em andamento', 'Arquivado', 'Concluído'
  const canAddEvidence = caseStatus === 'Em andamento';

  const takePhoto = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        setImages(prev => [...prev, image.dataUrl!]);
        toast({
          title: "Foto capturada!",
          description: "Imagem adicionada às evidências."
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast({
        title: "Erro ao capturar foto",
        description: "Verifique as permissões da câmera.",
        variant: "destructive"
      });
    }
  };

  const selectFromGallery = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        setImages(prev => [...prev, image.dataUrl!]);
        toast({
          title: "Imagem selecionada!",
          description: "Imagem adicionada às evidências."
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      toast({
        title: "Erro ao selecionar imagem",
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "Adicione pelo menos uma imagem",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simular upload das evidências
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Evidências salvas!",
        description: `${images.length} imagens foram enviadas com sucesso.`
      });
      
      navigate(`/cases/${caseId}`);
    } catch (error) {
      toast({
        title: "Erro ao salvar evidências",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!canAddEvidence) {
    return (
      <div className="p-4 pb-20 space-y-4" style={{ backgroundColor: '#f5f5f0' }}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/cases/${caseId}`)}
            className="text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Evidências do Caso</h1>
        </div>

        {/* Status Warning */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-medium text-orange-800">Caso não permite novas evidências</h3>
              <p className="text-sm text-orange-700">
                Este caso está com status "{caseStatus}" e não permite adição de novas evidências.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Existing Evidences - Mock data */}
        <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Evidências Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Radiografia panorâmica</p>
                  <p className="text-sm text-gray-600">Foto • 2024-01-15</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/evidence/${caseId}/1`)}
                >
                  Ver
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Foto intraoral</p>
                  <p className="text-sm text-gray-600">Foto • 2024-01-15</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/evidence/${caseId}/2`)}
                >
                  Ver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-4" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/cases/${caseId}`)}
          className="text-gray-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">Capturar Evidências</h1>
          <Badge variant="outline" className="mt-1">
            Status: {caseStatus}
          </Badge>
        </div>
      </div>

      {/* Camera Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={takePhoto}
          className="h-16 flex flex-col gap-2"
          style={{ backgroundColor: '#123458' }}
        >
          <Camera className="w-6 h-6" />
          <span className="text-sm">Tirar Foto</span>
        </Button>
        <Button
          onClick={selectFromGallery}
          variant="outline"
          className="h-16 flex flex-col gap-2"
          style={{ borderColor: '#123458', color: '#123458' }}
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm">Galeria</span>
        </Button>
      </div>

      {/* Images Preview */}
      {images.length > 0 && (
        <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Imagens Capturadas ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Evidência ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg bg-white"
                  />
                  <Button
                    onClick={() => removeImage(index)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 w-6 h-6"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description Form */}
      <Card style={{ backgroundColor: '#D4C9BE' }} className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Anotações</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-gray-700">
                Descrição das Evidências
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as evidências capturadas, condições do exame, observações importantes..."
                className="bg-white min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/cases/${caseId}`)}
                className="flex-1"
                style={{ borderColor: '#123458', color: '#123458' }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || images.length === 0}
                className="flex-1"
                style={{ backgroundColor: '#123458' }}
              >
                {loading ? 'Salvando...' : 'Salvar Evidências'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Dicas para Captura</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Mantenha boa iluminação</li>
            <li>• Evite tremores durante a captura</li>
            <li>• Capture diferentes ângulos quando necessário</li>
            <li>• Inclua régua ou referência de tamanho quando possível</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceScreen;
