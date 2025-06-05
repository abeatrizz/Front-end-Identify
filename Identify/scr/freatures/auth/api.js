export const loginApi = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!email || !password) {
          reject(new Error('Email e senha são obrigatórios'));
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          reject(new Error('Formato de email inválido'));
          return;
        }

        resolve({ success: true, token: 'fake-token' });
      } catch (error) {
        reject(new Error('Erro interno no login'));
      }
    }, Math.random() * 1000 + 500);
  });
};