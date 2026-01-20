import React from 'react';
import '../../styles/ui.css';

interface IconProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Icon: React.FC<IconProps> = ({ 
  children, 
  size = 'md',
  color = 'inherit' 
}) => {
  return (
    <span 
      className={`ui-icon ui-icon-${size}`}
      style={{ color }}
    >
      {children}
    </span>
  );
};

export default Icon;