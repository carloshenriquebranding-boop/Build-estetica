import * as React from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  const id = React.useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
      <div className="relative flex items-center h-10 w-full rounded-md border border-gray-300 dark:border-slate-600 px-2 bg-white dark:bg-slate-700">
        <div className="w-6 h-6 rounded-full border dark:border-slate-500" style={{ backgroundColor: color }} />
        <input
            type="color"
            id={id}
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
        <span className="ml-2 text-sm">{color.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ColorPicker;