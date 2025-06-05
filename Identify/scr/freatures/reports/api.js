const mockReports = [
  { id: '1', title: 'Relatório de Caso 1', content: 'Detalhes do relatório do caso 1.' },
  { id: '2', title: 'Relatório de Caso 2', content: 'Detalhes do relatório do caso 2.' },
];

const getRandomDelay = () => Math.random() * 300 + 400;

export const fetchReports = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const reportsData = [...mockReports];
        resolve(reportsData);
      } catch (error) {
        reject(new Error('Erro ao carregar relatórios'));
      }
    }, getRandomDelay());
  });
};

export const fetchReportById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!id) {
          reject(new Error('ID do relatório é obrigatório'));
          return;
        }

        const reportFound = mockReports.find(report => report.id === id);
        
        if (!reportFound) {
          reject(new Error('Relatório não encontrado'));
          return;
        }

        resolve(reportFound);
      } catch (error) {
        reject(new Error('Erro ao buscar relatório'));
      }
    }, getRandomDelay());
  });
};