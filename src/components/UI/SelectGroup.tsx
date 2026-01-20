import React from 'react';
import Select, { type SelectOption } from './Select';

interface SelectGroupProps {
  label: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  description?: string;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  options,
  value,
  onChange,
  description,
}) => {
  const groupedOptions = options.reduce((acc, option) => {
    if (typeof option.label === 'string') {
      const group = option.label.charAt(0).toUpperCase();
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(option);
    }
    return acc;
  }, {} as Record<string, SelectOption[]>);

  return (
    <div className="select-group">
      <Select
        label={label}
        value={value}
        onChange={onChange}
        options={options}
      />
      
      {description && (
        <div className="mt-2 text-sm text-gray-600">
          {description}
        </div>
      )}
      
      {/* Альтернативный вид сгруппированного селекта */}
      {Object.keys(groupedOptions).length > 1 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Быстрый выбор:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group} className="flex-1 min-w-[120px]">
                <div className="text-xs text-gray-500 mb-1">{group}</div>
                <select
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  onChange={(e) => onChange(e.target.value)}
                  value=""
                >
                  <option value="">{group}...</option>
                  {groupOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectGroup;