export const formatDate = (date) => {
  try {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

export const formatCurrency = (value) => {
  try {
    if (typeof value !== 'number' || isNaN(value)) {
      return '';
    }
    
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    return '';
  }
};

export const capitalize = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return '';
    }
    
    return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1).toLowerCase();
  } catch (error) {
    console.error('Erro ao capitalizar texto:', error);
    return '';
  }
};
