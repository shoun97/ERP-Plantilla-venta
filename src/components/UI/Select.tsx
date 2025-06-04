import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <select
        className={`
          w-full rounded-lg border border-gray-300 bg-white py-2 px-4 appearance-none
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-pink-500 focus:ring-pink-500'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:opacity-50 disabled:bg-gray-100
          transition duration-150 ease-in-out
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
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

export default Select;