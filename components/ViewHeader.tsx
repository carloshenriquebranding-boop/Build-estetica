import * as React from 'react';
import { ArrowLeft } from './icons/index.ts';

interface ViewHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
}

const ViewHeader: React.FC<ViewHeaderProps> = ({ title, showBackButton, onBack, children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">{title}</h1>
      </div>
      {children && <div className="flex gap-2 w-full sm:w-auto">{children}</div>}
    </div>
  );
};

export default ViewHeader;
