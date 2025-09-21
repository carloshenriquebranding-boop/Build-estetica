
import * as React from 'react';
import type { Stage } from '../types.ts';
import { MoreHorizontal } from './icons/MoreHorizontal.tsx';
import { Palette } from './icons/Palette.tsx';
import { Trash } from './icons/Trash.tsx';
import { STAGE_COLORS } from '../utils/colors.ts';

interface ColumnOptionsDropdownProps {
  stage: Stage;
  onUpdateStage: (stageId: string, updates: Partial<Omit<Stage, 'id'>>) => void;
  onDeleteStage: (stageId: string) => void;
}

const ColumnOptionsDropdown: React.FC<ColumnOptionsDropdownProps> = ({ stage, onUpdateStage, onDeleteStage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showColorPalette, setShowColorPalette] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowColorPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleColorSelect = (colorName: string) => {
    onUpdateStage(stage.id, { color: colorName });
    setIsOpen(false);
    setShowColorPalette(false);
  };

  const handleDelete = () => {
    onDeleteStage(stage.id);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-slate-600">
          {!showColorPalette ? (
            <ul className="py-1">
              <li>
                <button 
                  onClick={() => setShowColorPalette(true)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Palette className="w-4 h-4" />
                  <span>Alterar Cor</span>
                </button>
              </li>
              <li>
                 <button 
                    onClick={handleDelete}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50"
                 >
                    <Trash className="w-4 h-4" />
                    <span>Excluir Coluna</span>
                 </button>
              </li>
            </ul>
          ) : (
             <div className="p-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 px-2 pb-2">Escolha uma cor</p>
                <div className="grid grid-cols-4 gap-2">
                    {STAGE_COLORS.map(color => (
                        <button
                            key={color.name}
                            onClick={() => handleColorSelect(color.name)}
                            className={`w-8 h-8 rounded-md ${color.bg} transition-transform hover:scale-110 border-2 ${stage.color === color.name ? 'border-gray-800 dark:border-slate-200' : 'border-transparent'}`}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColumnOptionsDropdown;
