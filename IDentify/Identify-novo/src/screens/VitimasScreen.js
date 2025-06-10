
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, User, Edit, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { VictimaRequest } from '@/types/api';
import { useVitimas, useCreateVitima, useUpdateVitima, useDeleteVitima } from '@/hooks/useApiVitimas';
import StandardHeader from '@/components/StandardHeader';

const VitimasScreen = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVitima, setEditingVitima] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vitimas = [], isLoading } = useVitimas(caseId);
  const createVitima = useCreateVitima();
  const updateVitima = useUpdateVitima();
  const deleteVitima = useDeleteVitima();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<VictimaRequest>();

  const filteredVitimas = vitimas.filter(vitima =>
    vitima.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vitima.nic.includes(searchTerm)
  );

  const onSubmit = async (data: VictimaRequest) => {
    try {
      const vitimaData = {
        ...data,
        casoId: caseId!
      };

      if (editingVitima) {
        await updateVitima.mutateAsync({ id: editingVitima._id, data: vitimaData });
      } else {
        await createVitima.mutateAsync(vitimaData);
      }

      setIsModalOpen(false);
      reset();
      setEditingVitima(null);
    } catch (error) {
      console.error('Error saving vitima:', error);
    }
  };

  const handleEdit = (vitima: any) => {
    setEditingVitima(vitima);
    setValue('nic', vitima.nic);
    setValue('nome', vitima.nome);
    setValue('genero', vitima.genero);
    setValue('idade', vitima.idade);
    setValue('documento', vitima.documento);
    setValue('endereco', vitima.endereco);
    setValue('corEtnia', vitima.corEtnia);
    setValue('observacoes', vitima.observacoes);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta vítima?')) {
      try {
        await deleteVitima.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting vitima:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
        <StandardHeader title="Vítimas" />
        <div className="p-4 pb-24">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">Carregando vítimas...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      <StandardHeader 
        title="Vítimas" 
        rightElement={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setEditingVitima(null);
                  reset();
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVitima ? 'Editar Vítima' : 'Nova Vítima'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nic">NIC (8 dígitos)</Label>
                    <Input
                      id="nic"
                      {...register('nic', { 
                        required: 'NIC é obrigatório',
                        pattern: {
                          value: /^\d{8}$/,
                          message: 'NIC deve ter exatamente 8 dígitos'
                        }
                      })}
                      maxLength={8}
                      placeholder="12345678"
                    />
                    {errors.nic && <p className="text-red-500 text-sm">{errors.nic.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      {...register('nome', { required: 'Nome é obrigatório' })}
                      placeholder="Nome da vítima"
                    />
                    {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="genero">Gênero</Label>
                    <Select onValueChange={(value) => setValue('genero', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Não informado">Não informado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      type="number"
                      {...register('idade', { valueAsNumber: true })}
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <Label htmlFor="corEtnia">Cor/Etnia</Label>
                    <Select onValueChange={(value) => setValue('corEtnia', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Branca">Branca</SelectItem>
                        <SelectItem value="Preta">Preta</SelectItem>
                        <SelectItem value="Parda">Parda</SelectItem>
                        <SelectItem value="Amarela">Amarela</SelectItem>
                        <SelectItem value="Indígena">Indígena</SelectItem>
                        <SelectItem value="Não informado">Não informado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="documento">Documento</Label>
                  <Input
                    id="documento"
                    {...register('documento')}
                    placeholder="CPF, RG ou outro documento"
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    {...register('endereco')}
                    placeholder="Endereço completo"
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    {...register('observacoes')}
                    placeholder="Observações adicionais"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createVitima.isPending || updateVitima.isPending}>
                    {editingVitima ? 'Atualizar' : 'Cadastrar'}
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
        }
      />

      <div className="p-4 pb-24 space-y-4">
        {/* Busca */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Vítimas */}
        <div className="space-y-4">
          {filteredVitimas.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Nenhuma vítima encontrada</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredVitimas.map((vitima) => (
              <Card key={vitima._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {vitima.nome}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          NIC: {vitima.nic}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <span>👤 {vitima.genero}</span>
                        {vitima.idade && <span>🎂 {vitima.idade} anos</span>}
                        {vitima.corEtnia && <span>🏷️ {vitima.corEtnia}</span>}
                        {vitima.documento && <span>📄 {vitima.documento}</span>}
                      </div>
                      {vitima.observacoes && (
                        <p className="text-sm text-gray-600 mt-2">{vitima.observacoes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(vitima)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(vitima._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default VitimasScreen;
