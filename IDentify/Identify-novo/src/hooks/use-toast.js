import { Alert } from 'react-native';

const TOAST_DURATION = 3000; // 3 segundos

const toast = ({ title, description, variant = 'default' }) => {
  // Mapear variantes para cores de botão
  const buttonColors = {
    default: '#123458',
    destructive: '#dc2626',
    success: '#16a34a',
    warning: '#ca8a04',
  };

  // Criar botões com cores específicas
  const buttons = [
    {
      text: 'OK',
      style: 'default',
      onPress: () => {},
    },
  ];

  // Adicionar botão de ação se fornecido
  if (variant === 'destructive') {
    buttons.unshift({
      text: 'Cancelar',
      style: 'cancel',
      onPress: () => {},
    });
  }

  // Mostrar alerta
  Alert.alert(
    title,
    description,
    buttons,
    { cancelable: true }
  );
};

const useToast = () => {
  return {
    toast,
    dismiss: () => {}, // Não é necessário em React Native
  };
};

export { useToast, toast };
