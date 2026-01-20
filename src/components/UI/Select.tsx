import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import '../../styles/ui.css';

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'ghost';
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  disabled = false,
  className = '',
  label,
  error,
  size = 'md',
  variant = 'outline',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-1 px-2 text-sm';
      case 'lg': return 'py-3 px-4 text-lg';
      default: return 'py-2 px-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-100 border-transparent hover:bg-gray-200';
      case 'ghost':
        return 'bg-transparent border-transparent hover:bg-gray-100';
      default:
        return 'bg-white border-gray-300 hover:border-blue-500';
    }
  };

  const getOptionClasses = (option: SelectOption) => {
    const baseClasses = 'flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100';
    const selectedClasses = option.value === value ? 'bg-blue-50 text-blue-600' : '';
    return `${baseClasses} ${selectedClasses}`;
  };

  return (
    <div className={`select-container ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          className={`
            w-full flex items-center justify-between
            border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${getSizeClasses()}
            ${getVariantClasses()}
            ${error ? 'border-red-500' : ''}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            {selectedOption?.icon && (
              <span className="text-gray-500">{selectedOption.icon}</span>
            )}
            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
          </div>
          
          <Icon size="sm">
            {isOpen ? '▲' : '▼'}
          </Icon>
        </button>

        {isOpen && (
          <div className="
            absolute z-50 w-full mt-1
            bg-white border border-gray-300 rounded-lg shadow-lg
            max-h-60 overflow-y-auto
            animate-fadeIn
          ">
            <div role="listbox" aria-label="Выберите опцию">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={getOptionClasses(option)}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.icon && (
                    <span className="text-gray-500">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                  
                  {option.value === value && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {!error && value && (
        <div className="mt-1 text-xs text-gray-500">
          Выбрано: {selectedOption?.label}
        </div>
      )}
    </div>
  );
};

export default Select;

// Компонент для простого select (альтернативная реализация - стилизованный нативный select)
export const SimpleSelect: React.FC<Omit<SelectProps, 'variant'> & {
  fullWidth?: boolean;
}> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  label,
  error,
  size,
  fullWidth = true,
}) => {
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-3 px-4',
  };

  return (
    <div className={`simple-select ${className} ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <select
        className={`
          block border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-white
          ${sizeClasses[size || 'md']}
          ${error ? 'border-red-500' : ''}
          ${fullWidth ? 'w-full' : ''}
        `}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          // Сохраняем тип значения (число/строка)
          const option = options.find(opt => opt.value.toString() === val);
          onChange(option?.value ?? val);
        }}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};