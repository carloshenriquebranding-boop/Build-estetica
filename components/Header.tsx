import * as React from 'react';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    return (
        <header className="flex-shrink-0 bg-white dark:bg-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-slate-700 z-20 md:hidden">
            <button 
                onClick={onMenuToggle}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                aria-label="Abrir menu"
            >
                Menu
            </button>
            <div className="text-xl font-bold text-pink-500">
                EstéticaCRM
            </div>
        </header>
    );
};

export default Header;