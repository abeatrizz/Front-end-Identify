
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Edit, Trash2, Search, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { LaudoRequest } from '@/types/api';
import { useLaudos, useCreateLaudo, useUpdateLaudo, useDeleteLaudo } from '@/hooks/useApiLaudos';
import { useCasos } from '@/hooks/useApiCasos';
import StandardHeader from '@/components/StandardHeader';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LaudosScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaudo, setEditingLaudo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: laudos = [], isLoading } = useLaudos();
  const { data: casos = [] } = useCasos();
  const createLaudo = useCreateLaudo();
  const updateLaudo = useUpdateLaudo();
  const deleteLaudo = useDeleteLaudo();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<LaudoRequest>();

  const filteredLaudos = laudos.filter(laudo =>
    laudo.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laudo.conclusoes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: LaudoRequest) => {
    try {
      if (editingLaudo) {
        await updateLaudo.mutateAsync({ id: editingLaudo._id, data });
      } else {
        await createLaudo.mutateAsync(data);
      }

      setIsModalOpen(false);
      reset();
      setEditingLaudo(null);
    } catch (error) {
      console.error('Error saving laudo:', error);
    }
  };

  const handleEdit = (laudo: any) => {
    setEditingLaudo(laudo);
    setValue('casoId', laudo.casoId);
    setValue('descricao', laudo.descricao);
    setValue('conclusoes', laudo.conclusoes);
    setValue('perito', laudo.perito);
    setValue('observacoes', laudo.observacoes);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este laudo?')) {
      try {
        await deleteLaudo.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting laudo:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
        <StandardHeader title="Laudos" />
        <div className="p-4 pb-24">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">Carregando laudos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      <StandardHeader 
        title="Laudos" 
        rightElement={
          user?.tipoUsuario === 'perito' || user?.tipoUsuario === 'admin' ? (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setEditingLaudo(null);
                    reset();
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLaudo ? 'Editar Laudo' : 'Novo Laudo'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="casoId">Caso</Label>
                      <Select onValueChange={(value) => setValue('casoId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um caso" />
                        </SelectTrigger>
                        <SelectContent>
                          {casos.map((caso) => (
                            <SelectItem key={caso._id} value={caso._id}>
                              {caso.titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.casoId && <p className="text-red-500 text-sm">{errors.casoId.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="perito">Perito Responsável</Label>
                      <Input
                        id="perito"
                        {...register('perito', { required: 'Perito é obrigatório' })}
                        placeholder="Nome do perito"
                        defaultValue={user?.nome}
                      />
                      {errors.perito && <p className="text-red-500 text-sm">{errors.perito.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      {...register('descricao', { required: 'Descrição é obrigatória' })}
                      placeholder="Descreva o laudo pericial..."
                      rows={4}
                    />
                    {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="conclusoes">Conclusões</Label>
                    <Textarea
                      id="conclusoes"
                      {...register('conclusoes', { required: 'Conclusões são obrigatórias' })}
                      placeholder="Conclusões do laudo pericial..."
                      rows={6}
                    />
                    {errors.conclusoes && <p className="text-red-500 text-sm">{errors.conclusoes.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      {...register('observacoes')}
                      placeholder="Observações adicionais (opcional)"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={createLaudo.isPending || updateLaudo.isPending}>
                      {editingLaudo ? 'Atualizar' : 'Criar Laudo'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <div className="p-4 pb-24 space-y-4">
        {/* Busca */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar laudos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Laudos */}
        <div className="space-y-4">
          {filteredLaudos.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Nenhum laudo encontrado</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredLaudos.map((laudo) => (
              <Card key={laudo._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg text-gray-900">
                          Laudo #{laudo._id.slice(-6)}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        👨‍⚕️ Perito: {laudo.perito}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        📅 Criado em: {formatDate(laudo.dataCriacao)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Descrição:</h4>
                      <p className="text-sm text-gray-700 line-clamp-2">{laudo.descricao}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Conclusões:</h4>
                      <p className="text-sm text-gray-700 line-clamp-3">{laudo.conclusoes}</p>
                    </div>
                    
                    {laudo.observacoes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Observações:</h4>
                        <p className="text-sm text-gray-600">{laudo.observacoes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    
                    {(user?.tipoUsuario === 'perito' || user?.tipoUsuario === 'admin') && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(laudo)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(laudo._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LaudosScreen;
