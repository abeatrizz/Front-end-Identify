import React, { useState } from 'react';
import { useParams, useNavigation } from 'react-router-dom';
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
  const navigate = useNavigation();
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
          <Text style={styles.title}>Evidências do Caso</Text>
        </View>

        {/* Status Warning */}
        <Card >
          <CardContent >
            <AlertCircle  />
            <View>
              <Text style={styles.title}>Caso não permite novas evidências</Text>
              <Text>
                Este caso está com status "{caseStatus}" e não permite adição de novas evidências.
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Existing Evidences - Mock data */}
        <Card style={{ backgroundColor: '#D4C9BE' }} >
          <CardHeader>
            <CardTitle >Evidências Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <View >
              <View >
                <View >
                  <Text>Radiografia panorâmica</Text>
                  <Text>Foto • 2024-01-15</Text>
                </View>
                <Button 
                  size="sm" 
                  variant="outline"
                  onPress={() => navigate(`/evidence/${caseId}/1`)}
                >
                  Ver
                </Button>
              </View>
              <View >
                <View >
                  <Text>Foto intraoral</Text>
                  <Text>Foto • 2024-01-15</Text>
                </View>
                <Button 
                  size="sm" 
                  variant="outline"
                  onPress={() => navigate(`/evidence/${caseId}/2`)}
                >
                  Ver
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    );
  }

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
          <Text style={styles.title}>Capturar Evidências</Text>
          <Badge variant="outline" >
            Status: {caseStatus}
          </Badge>
        </View>
      </View>

      {/* Camera Actions */}
      <View >
        <Button
          onPress={takePhoto}
          
          style={{ backgroundColor: '#123458' }}
        >
          <Camera  />
          <span >Tirar Foto</span>
        </Button>
        <Button
          onPress={selectFromGallery}
          variant="outline"
          
          style={{ borderColor: '#123458', color: '#123458' }}
        >
          <Upload  />
          <span >Galeria</span>
        </Button>
      </View>

      {/* Images Preview */}
      {images.length > 0 && (
        <Card style={{ backgroundColor: '#D4C9BE' }} >
          <CardHeader>
            <CardTitle >Imagens Capturadas ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <View >
              {images.map((image, index) => (
                <View key={index} >
                  <img
                    src={image}
                    alt={`Evidência ${index + 1}`}
                    
                  />
                  <Button
                    onPress={() => removeImage(index)}
                    size="icon"
                    variant="destructive"
                    
                  >
                    ×
                  </Button>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      )}

      {/* Description Form */}
      <Card style={{ backgroundColor: '#D4C9BE' }} >
        <CardHeader>
          <CardTitle >Anotações</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
            <View>
              <Label htmlFor="description" >
                Descrição das Evidências
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as evidências capturadas, condições do exame, observações importantes..."
                
                required
              />
            </View>

            <View >
              <Button
                type="button"
                variant="outline"
                onPress={() => navigate(`/cases/${caseId}`)}
                
                style={{ borderColor: '#123458', color: '#123458' }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || images.length === 0}
                
                style={{ backgroundColor: '#123458' }}
              >
                {loading ? 'Salvando...' : 'Salvar Evidências'}
              </Button>
            </View>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card >
        <CardContent >
          <Text style={styles.title}>Dicas para Captura</Text>
          <ul >
            <li>• Mantenha boa iluminação</li>
            <li>• Evite tremores durante a captura</li>
            <li>• Capture diferentes ângulos quando necessário</li>
            <li>• Inclua régua ou referência de tamanho quando possível</li>
          </ul>
        </CardContent>
      </Card>
    </View>
  );
};

export default EvidenceScreen;
