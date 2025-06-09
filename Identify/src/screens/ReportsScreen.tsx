import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Eye, Search, Filter, Calendar, X, Mic, Play } from 'lucide-react';

const ReportsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Mock data dos relatórios
  const reports = [
    {
      id: '1',
      caseNumber: '#6831121',
      title: 'Laudo Pericial - Análise Dental',
      patient: 'João da Silva',
      perito: 'Dr. João Silva',
      status: 'Concluído',
      date: '2024-01-15',
      type: 'Laudo Completo',
      confidence: 95
    },
    {
      id: '2',
      caseNumber: '#6831122',
      title: 'Relatório Preliminar',
      patient: 'Maria Santos',
      perito: 'Dr. João Silva',
      status: 'Em andamento',
      date: '2024-01-14',
      type: 'Relatório Parcial',
      confidence: 78
    },
    {
      id: '3',
      caseNumber: '#6831120',
      title: 'Análise Comparativa',
      patient: 'Pedro Oliveira',
      perito: 'Dr. João Silva',
      status: 'Arquivado',
      date: '2024-01-10',
      type: 'Análise IA',
      confidence: 89
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Arquivado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Laudo Completo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Relatório Parcial': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Análise IA': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const ReportPreview = ({ report }: { report: any }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Cabeçalho do relatório */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">{report.title}</h2>
        <div className="flex gap-2 mt-2">
          <Badge className={getStatusColor(report.status)}>
            {report.status}
          </Badge>
          <Badge className={getTypeColor(report.type)}>
            {report.type}
          </Badge>
        </div>
      </div>

      {/* Informações do caso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Caso:</span>
          <p className="text-gray-600">{report.caseNumber}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Paciente:</span>
          <p className="text-gray-600">{report.patient}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Perito:</span>
          <p className="text-gray-600">{report.perito}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Data:</span>
          <p className="text-gray-600">{report.date}</p>
        </div>
      </div>

      {/* Confiança da IA */}
      {report.confidence && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="font-semibold text-gray-700">Confiança da Análise:</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  report.confidence >= 90 ? 'bg-green-500' :
                  report.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{report.confidence}%</span>
          </div>
        </div>
      )}

      {/* Conteúdo simulado do relatório */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Resumo Executivo</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Este laudo apresenta a análise pericial odontológica realizada para identificação 
            através de registros dentários. A análise foi conduzida utilizando técnicas 
            tradicionais combinadas com inteligência artificial para maior precisão.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Metodologia</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Foi realizada comparação entre registros ante-mortem e post-mortem, 
            incluindo análise de restaurações, anatomia dental e características específicas.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Conclusão</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Com base na análise realizada, foi possível estabelecer {report.confidence >= 90 ? 'identificação positiva' : 'similaridades significativas'} 
            entre os registros comparados.
          </p>
        </div>

        {/* Notas de áudio simuladas com cores neutras */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Notas de Áudio
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
              <span className="text-sm text-gray-600">Observações iniciais - 2:15</span>
              <Button size="sm" variant="outline" className="border-gray-300">
                <Play className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
              <span className="text-sm text-gray-600">Conclusões finais - 1:45</span>
              <Button size="sm" variant="outline" className="border-gray-300">
                <Play className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header com cores originais */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold">Relatórios e Laudos</h1>
            <p className="text-gray-300 text-sm">Consulte e baixe seus relatórios</p>
          </div>
        </div>
      </div>

      <div className="p-4 pb-24 space-y-4">
        {/* Filtros com cores neutras */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 border border-gray-200 pl-10 h-12 rounded-lg focus:border-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-50 border border-gray-200 h-11">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-gray-50 border border-gray-200 h-11">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <SelectValue placeholder="Período" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo período</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Relatórios com cores neutras */}
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg leading-tight">{report.title}</h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Caso:</span>
                      <span className="font-medium">{report.caseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paciente:</span>
                      <span className="font-medium">{report.patient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">{report.date}</span>
                    </div>
                  </div>

                  {report.confidence && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Confiança da IA</span>
                        <span className="text-xs font-medium">{report.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            report.confidence >= 90 ? 'bg-green-500' :
                            report.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${report.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            Preview do Relatório
                          </DialogTitle>
                        </DialogHeader>
                        <ReportPreview report={report} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card className="bg-white border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum relatório encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca</p>
            </CardContent>
          </Card>
        )}

        {/* FAB para novo relatório */}
        <div className="fixed bottom-24 right-4">
          <Button
            size="lg"
            className="rounded-full shadow-lg w-14 h-14"
            style={{ backgroundColor: '#123458' }}
          >
            <FileText className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsScreen;
