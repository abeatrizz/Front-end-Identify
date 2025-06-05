export const loginApi = async (email, password) => {
  // Simulação de API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ success: true, token: 'fake-token' });
      } else {
        resolve({ success: false, message: 'Credenciais inválidas' });
      }
    }, 1500);
  });
};
