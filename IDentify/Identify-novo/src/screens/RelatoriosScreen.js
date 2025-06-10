
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Download, Calendar, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { RelatorioRequest } from '@/types/api';
import { useRelatorios, useCreateRelatorio } from '@/hooks/useApiRelatorios';
import { useCasos } from '@/hooks/useApiCasos';
import StandardHeader from '@/components/StandardHeader';
import { useAuth } from '@/hooks/useAuth';

const RelatoriosScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: relatorios = [], isLoading } = useRelatorios();
  const { data: casos = [] } = useCasos();
  const createRelatorio = useCreateRelatorio();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RelatorioRequest>();
  const tipoRelatorio = watch('tipo');

  const onSubmit = async (data: RelatorioRequest) => {
    try {
      await createRelatorio.mutateAsync(data);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating relatorio:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'geral':
        return 'Relatório Geral';
      case 'caso':
        return 'Relatório de Caso';
      case 'periodo':
        return 'Relatório por Período';
      default:
        return tipo;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
        <StandardHeader title="Relatórios" />
        <div className="p-4 pb-24">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">Carregando relatórios...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      <StandardHeader 
        title="Relatórios" 
        rightElement={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  reset();
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Gerar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gerar Novo Relatório</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Relatório</Label>
                  <Select onValueChange={(value) => setValue('tipo', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geral">Relatório Geral</SelectItem>
                      <SelectItem value="caso">Relatório de Caso Específico</SelectItem>
                      <SelectItem value="periodo">Relatório por Período</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo.message}</p>}
                </div>

                {tipoRelatorio === 'caso' && (
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
                  </div>
                )}

                {tipoRelatorio === 'periodo' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataInicio">Data Início</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        {...register('dataInicio')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataFim">Data Fim</Label>
                      <Input
                        id="dataFim"
                        type="date"
                        {...register('dataFim')}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createRelatorio.isPending}>
                    {createRelatorio.isPending ? 'Gerando...' : 'Gerar Relatório'}
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
        {/* Cards de Tipos de Relatório */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Relatórios Gerais</h3>
                  <p className="text-blue-700 text-sm">Visão geral do sistema</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Relatórios de Casos</h3>
                  <p className="text-green-700 text-sm">Detalhes específicos por caso</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Relatórios Temporais</h3>
                  <p className="text-purple-700 text-sm">Análise por período</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Relatórios */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Relatórios Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatorios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Nenhum relatório gerado ainda</p>
                </div>
              ) : (
                relatorios.map((relatorio) => (
                  <div 
                    key={relatorio._id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-gray-900">
                          {getTipoLabel(relatorio.tipo)} #{relatorio._id.slice(-6)}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        📅 Gerado em: {formatDate(relatorio.dataCriacao)}
                      </p>
                      <p className="text-sm text-gray-600">
                        👤 Por: {relatorio.geradoPor}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelatoriosScreen;
