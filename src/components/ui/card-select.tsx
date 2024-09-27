import React from 'react';
import Image from 'next/image';

interface Option {
  value: string;
  label: string;
  icon: string;
  width: number;
  height: number;
}

interface CardSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const CardSelect: React.FC<CardSelectProps> = ({ options, value, onChange, name }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option) => (
        <div
          key={option.value}
          className={`cursor-pointer border rounded-lg p-4 flex items-center ${
            value === option.value 
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900' 
              : 'border-gray-200 dark:border-gray-700'
          } dark:text-white`}
          onClick={() => onChange(option.value)}
        >
          <Image 
            src={option.icon} 
            alt={option.label} 
            width={option.width} 
            height={option.height} 
            className="mr-3 dark:invert" 
          />
          <span className="text-sm sm:text-base">{option.label}</span>
          <input
            type="radio"
            name={name}
            title={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={() => {}}
            className="hidden"
          />
        </div>
      ))}
    </div>
  );
};

export default CardSelect;