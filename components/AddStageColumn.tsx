import * as React from 'react';
import { Plus } from './icons/Plus.tsx';
import { X } from './icons/X.tsx';

interface AddStageColumnProps {
  onAddStage: (title: string) => void;
}

const AddStageColumn: React.FC<AddStageColumnProps> = ({ onAddStage }) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [title, setTitle] = React.useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAddStage(title);
      setTitle('');
      setIsAdding(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-72 md:w-80 flex-shrink-0 flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
        style={{ minHeight: '80px', alignSelf: 'flex-start' }}
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">Adicionar outra coluna</span>
      </button>
    );
  }

  return (
    <div className="w-72 md:w-80 flex-shrink-0 p-2 bg-gray-200 rounded-xl" style={{alignSelf: 'flex-start'}}>
      <input
        type="text"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (!title.trim()) setIsAdding(false); }}
        placeholder="Digite o nome da coluna..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
      />
      <div className="mt-2 flex items-center gap-2">
        <button onClick={handleAdd} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600">
          Adicionar
        </button>
        <button onClick={() => setIsAdding(false)} className="text-gray-500 p-2 hover:bg-gray-300 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AddStageColumn;