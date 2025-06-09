
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'dark',
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-12'
  };

  return (
    <View className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/1d36dd69-28ae-450d-a119-92e01f2bf92e.png" 
        alt="IIdentify" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </View>
  );
};

export default Logo;
