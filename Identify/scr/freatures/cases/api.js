const mockCases = [
  { id: '1', title: 'Caso 1', status: 'Aberto', date: '2025-06-05' },
  { id: '2', title: 'Caso 2', status: 'Em andamento', date: '2025-06-04' },
];

const getRandomDelay = () => Math.random() * 500 + 300;

export const fetchCases = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const casesData = [...mockCases];
        resolve(casesData);
      } catch (error) {
        reject(new Error('Erro ao carregar casos'));
      }
    }, getRandomDelay());
  });
};

export const fetchCaseById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!id) {
          reject(new Error('ID do caso é obrigatório'));
          return;
        }

        const caseFound = mockCases.find(caseItem => caseItem.id === id);
        
        if (!caseFound) {
          reject(new Error('Caso não encontrado'));
          return;
        }

        resolve(caseFound);
      } catch (error) {
        reject(new Error('Erro ao buscar caso'));
      }
    }, getRandomDelay());
  });
};