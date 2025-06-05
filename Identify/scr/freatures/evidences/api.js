const mockEvidences = [
  { id: '1', caseId: '1', description: 'Foto da cena', date: '2025-06-05' },
  { id: '2', caseId: '2', description: 'Vídeo da câmera de segurança', date: '2025-06-04' },
];

const getRandomDelay = () => Math.random() * 400 + 300;

export const fetchEvidences = async (caseId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!caseId) {
          reject(new Error('ID do caso é obrigatório'));
          return;
        }

        const evidences = mockEvidences.filter(evidence => evidence.caseId === caseId);
        resolve([...evidences]);
      } catch (error) {
        reject(new Error('Erro ao carregar evidências'));
      }
    }, getRandomDelay());
  });
};

export const uploadEvidence = async (caseId, evidenceData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!caseId) {
          reject(new Error('ID do caso é obrigatório'));
          return;
        }

        if (!evidenceData || !evidenceData.description) {
          reject(new Error('Dados da evidência são obrigatórios'));
          return;
        }

        const newEvidence = {
          id: String(Date.now()),
          caseId,
          ...evidenceData,
          uploadDate: new Date().toISOString(),
        };

        resolve({ success: true, evidence: newEvidence });
      } catch (error) {
        reject(new Error('Erro ao fazer upload da evidência'));
      }
    }, Math.random() * 800 + 700);
  });
};