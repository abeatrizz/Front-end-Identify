
import React from 'react';

interface ToothIllustrationProps {
  toothNumber: number;
  hasEvidence?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const ToothIllustration: React.FC<ToothIllustrationProps> = ({ 
  toothNumber, 
  hasEvidence = false, 
  onClick,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-10 h-12',
    lg: 'w-12 h-14'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <View 
      className={`${sizeClasses[size]} cursor-pointer transition-all hover:scale-110 active:scale-95 touch-manipulation relative`}
      onPress={onClick}
    >
      <svg
        viewBox="0 0 24 32"
        className={`w-full h-full transition-colors ${hasEvidence ? 'text-blue-500' : 'text-gray-400'} drop-shadow-sm`}
        fill="currentColor"
      >
        {/* Tooth shape with better mobile visibility */}
        <Text>
        {/* Root */}
        <Text>
        {/* Highlight for better visibility */}
        {hasEvidence && (
          <path d="M12 4C9.5 4 8 5.5 8 8v6c0 4 1.5 8 4 10 2.5-2 4-6 4-10V8c0-2.5-1.5-4-4-4z" 
                fill="white" opacity="0.3" />
        )}
      </svg>
      
      {/* Number with better mobile styling */}
      <View className={`absolute inset-0 flex items-center justify-center ${textSizeClasses[size]} font-bold text-white drop-shadow-md`}>
        {toothNumber}
      </View>
      
      {/* Evidence indicator with better mobile visibility */}
      {hasEvidence && (
        <View ></View>
      )}
      
      {/* Touch feedback overlay */}
      <View ></View>
    </View>
  );
};

export default ToothIllustration;
