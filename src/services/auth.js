import api from '../config/api';

export const loginUser = async (email, senha) => {
  try {
    const { data } = await api.post('/auth/login', {
      email,
      senha
    });

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const { data } = await api.post('/auth/recuperar-senha', { email });
    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (token, novaSenha) => {
  try {
    const { data } = await api.post('/auth/reset-password', {
      token,
      novaSenha
    });
    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}; 