
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
    <div 
      className={`${sizeClasses[size]} cursor-pointer transition-all hover:scale-110 active:scale-95 touch-manipulation relative`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 24 32"
        className={`w-full h-full transition-colors ${hasEvidence ? 'text-blue-500' : 'text-gray-400'} drop-shadow-sm`}
        fill="currentColor"
      >
        {/* Tooth shape with better mobile visibility */}
        <path d="M12 2C8 2 6 4 6 8v8c0 6 2 12 6 14 4-2 6-8 6-14V8c0-4-2-6-6-6z" />
        {/* Root */}
        <path d="M10 20v8c0 1 1 2 2 2s2-1 2-2v-8" opacity="0.7" />
        {/* Highlight for better visibility */}
        {hasEvidence && (
          <path d="M12 4C9.5 4 8 5.5 8 8v6c0 4 1.5 8 4 10 2.5-2 4-6 4-10V8c0-2.5-1.5-4-4-4z" 
                fill="white" opacity="0.3" />
        )}
      </svg>
      
      {/* Number with better mobile styling */}
      <div className={`absolute inset-0 flex items-center justify-center ${textSizeClasses[size]} font-bold text-white drop-shadow-md`}>
        {toothNumber}
      </div>
      
      {/* Evidence indicator with better mobile visibility */}
      {hasEvidence && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
      )}
      
      {/* Touch feedback overlay */}
      <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-10 active:opacity-20 bg-blue-500 transition-opacity pointer-events-none"></div>
    </div>
  );
};

export default ToothIllustration;
