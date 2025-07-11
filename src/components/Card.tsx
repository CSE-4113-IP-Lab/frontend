import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  cornerStyle?: 'tl' | 'tr' | 'bl' | 'br';
}

const Card: React.FC<CardProps> = ({ children, className = '', cornerStyle = 'tl' }) => {
  const cornerClasses = {
    tl: 'rounded-tl',
    tr: 'rounded-tr',
    bl: 'rounded-bl',
    br: 'rounded-br',
  };

  return (
    <div className={`bg-white shadow-card p-5 ${cornerClasses[cornerStyle]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;