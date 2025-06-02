import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200';
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  const hoverStyles = hoverable ? 'hover:shadow-md cursor-pointer transform hover:-translate-y-1' : '';
  
  return (
    <div 
      className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;