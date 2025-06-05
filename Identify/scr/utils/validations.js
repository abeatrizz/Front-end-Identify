export const isEmail = (email) => {
  try {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  } catch (error) {
    console.error('Erro ao validar email:', error);
    return false;
  }
};

export const isNotEmpty = (value) => {
  try {
    if (value === null || value === undefined) {
      return false;
    }
    
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    
    return Boolean(value);
  } catch (error) {
    console.error('Erro ao validar se não está vazio:', error);
    return false;
  }
};

export const minLength = (value, length) => {
  try {
    if (!value || typeof length !== 'number' || length < 0) {
      return false;
    }
    
    if (typeof value === 'string') {
      return value.trim().length >= length;
    }
    
    if (Array.isArray(value)) {
      return value.length >= length;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao validar tamanho mínimo:', error);
    return false;
  }
};
