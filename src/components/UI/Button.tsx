import React from 'react';
import '../../styles/ui.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  title: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  active = false, 
  title,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`ui-button ${active ? 'active' : ''} ${className}`}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;