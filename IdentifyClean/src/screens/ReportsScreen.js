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
    <View >
      {/* Cabeçalho do relatório */}
      <View >
        <Text style={styles.title}>{report.title}</Text>
        <View >
          <Badge className={getStatusColor(report.status)}>
            {report.status}
          </Badge>
          <Badge className={getTypeColor(report.type)}>
            {report.type}
          </Badge>
        </View>
      </View>

      {/* Informações do caso */}
      <View >
        <View>
          <span >Caso:</span>
          <Text>{report.caseNumber}</Text>
        </View>
        <View>
          <span >Paciente:</span>
          <Text>{report.patient}</Text>
        </View>
        <View>
          <span >Perito:</span>
          <Text>{report.perito}</Text>
        </View>
        <View>
          <span >Data:</span>
          <Text>{report.date}</Text>
        </View>
      </View>

      {/* Confiança da IA */}
      {report.confidence && (
        <View >
          <span >Confiança da Análise:</span>
          <View >
            <View >
              <View 
                className={`h-2 rounded-full ${
                  report.confidence >= 90 ? 'bg-green-500' :
                  report.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.confidence}%` }}
              ></View>
            </View>
            <span >{report.confidence}%</span>
          </View>
        </View>
      )}

      {/* Conteúdo simulado do relatório */}
      <View >
        <View>
          <Text style={styles.title}>Resumo Executivo</Text>
          <Text>
            Este laudo apresenta a análise pericial odontológica realizada para identificação 
            através de registros dentários. A análise foi conduzida utilizando técnicas 
            tradicionais combinadas com inteligência artificial para maior precisão.
          </Text>
        </View>

        <View>
          <Text style={styles.title}>Metodologia</Text>
          <Text>
            Foi realizada comparação entre registros ante-mortem e post-mortem, 
            incluindo análise de restaurações, anatomia dental e características específicas.
          </Text>
        </View>

        <View>
          <Text style={styles.title}>Conclusão</Text>
          <Text>
            Com base na análise realizada, foi possível estabelecer {report.confidence >= 90 ? 'identificação positiva' : 'similaridades significativas'} 
            entre os registros comparados.
          </Text>
        </View>

        {/* Notas de áudio simuladas com cores neutras */}
        <View >
          <Text style={styles.title}>
            <Mic  />
            Notas de Áudio
          </Text>
          <View >
            <View >
              <span >Observações iniciais - 2:15</span>
              <Button size="sm" variant="outline" >
                <Play  />
              </Button>
            </View>
            <View >
              <span >Conclusões finais - 1:45</span>
              <Button size="sm" variant="outline" >
                <Play  />
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View  style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header com cores originais */}
      <View >
        <View >
          <FileText  />
          <View>
            <Text style={styles.title}>Relatórios e Laudos</Text>
            <Text>Consulte e baixe seus relatórios</Text>
          </View>
        </View>
      </View>

      <View >
        {/* Filtros com cores neutras */}
        <Card >
          <CardContent >
            <View >
              <View >
                <Search  />
                <Input
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  
                />
              </View>
              
              <View >
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger >
                    <View >
                      <Filter  />
                      <SelectValue placeholder="Status" />
                    </View>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger >
                    <View >
                      <Calendar  />
                      <SelectValue placeholder="Período" />
                    </View>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo período</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Lista de Relatórios com cores neutras */}
        <View >
          {filteredReports.map((report) => (
            <Card key={report.id} >
              <CardContent >
                <View >
                  <View >
                    <View >
                      <Text style={styles.title}>{report.title}</Text>
                      <View >
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                      </View>
                    </View>
                  </View>
                  
                  <View >
                    <View >
                      <span >Caso:</span>
                      <span >{report.caseNumber}</span>
                    </View>
                    <View >
                      <span >Paciente:</span>
                      <span >{report.patient}</span>
                    </View>
                    <View >
                      <span >Data:</span>
                      <span >{report.date}</span>
                    </View>
                  </View>

                  {report.confidence && (
                    <View >
                      <View >
                        <span >Confiança da IA</span>
                        <span >{report.confidence}%</span>
                      </View>
                      <View >
                        <View 
                          className={`h-2 rounded-full transition-all ${
                            report.confidence >= 90 ? 'bg-green-500' :
                            report.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${report.confidence}%` }}
                        ></View>
                      </View>
                    </View>
                  )}

                  <View >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" >
                          <Eye  />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent >
                        <DialogHeader>
                          <DialogTitle >
                            Preview do Relatório
                          </DialogTitle>
                        </DialogHeader>
                        <ReportPreview report={report} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" variant="outline" >
                      <Download  />
                      PDF
                    </Button>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {filteredReports.length === 0 && (
          <Card >
            <CardContent >
              <FileText  />
              <Text style={styles.title}>Nenhum relatório encontrado</Text>
              <Text>Tente ajustar os filtros de busca</Text>
            </CardContent>
          </Card>
        )}

        {/* FAB para novo relatório */}
        <View >
          <Button
            size="lg"
            
            style={{ backgroundColor: '#123458' }}
          >
            <FileText  />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ReportsScreen;
