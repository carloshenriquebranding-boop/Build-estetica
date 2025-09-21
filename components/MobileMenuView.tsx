import * as React from 'react';
import { Home, LayoutGrid, Users, CalendarDays, MessageSquare, MoreHorizontal, CheckSquare, Briefcase, DollarSign, FileText, Settings, UserCircle, ShieldCheck, FileSpreadsheet, Search, HelpCircle, Megaphone } from './icons/index.ts';

interface MobileMenuViewProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isAdmin: boolean;
  onOpenSearch: () => void;
  onOpenHelp: () => void;
}

const mainItems = [
    { view: 'dashboard', label: 'Início', icon: <Home className="w-6 h-6" /> },
    { view: 'kanban', label: 'Funil', icon: <LayoutGrid className="w-6 h-6" /> },
    { view: 'calendar', label: 'Agenda', icon: <CalendarDays className="w-6 h-6" /> },
    { view: 'tasks', label: 'Tarefas', icon: <CheckSquare className="w-6 h-6" /> },
];

const allMenuItems = [
    { view: 'clients', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { view: 'omnichannel', label: 'Conversas', icon: <MessageSquare className="w-5 h-5" /> },
    { view: 'campaigns', label: 'Campanhas', icon: <Megaphone className="w-5 h-5" /> },
    { view: 'services', label: 'Serviços', icon: <Briefcase className="w-5 h-5" /> },
    { view: 'financial', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
    { view: 'notes', label: 'Notas', icon: <FileText className="w-5 h-5" /> },
    { view: 'prescription', label: 'Prescrições', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { view: 'budget', label: 'Orçamentos', icon: <FileText className="w-5 h-5" /> },
    { view: 'help', label: 'Ajuda', icon: <HelpCircle className="w-5 h-5" /> },
    { view: 'search', label: 'Busca', icon: <Search className="w-5 h-5" /> },
    { view: 'profile', label: 'Meu Perfil', icon: <UserCircle className="w-5 h-5" /> },
    { view: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
];


const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  view: string;
  activeView: string;
  onClick: (view: string) => void;
}> = ({ icon, label, view, activeView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex flex-col items-center justify-center gap-1 p-2 flex-grow transition-colors ${
      activeView === view
        ? 'text-pink-600 dark:text-pink-400'
        : 'text-gray-500 dark:text-slate-400 hover:text-pink-500'
    }`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);


const MoreMenuModal: React.FC<{ 
    onClose: () => void;
    isAdmin: boolean; 
    activeView: string;
    setActiveView: (view: string) => void;
    onOpenSearch: () => void;
    onOpenHelp: () => void;
}> = ({ onClose, isAdmin, activeView, setActiveView, onOpenSearch, onOpenHelp }) => {
    
    const handleSelect = (view: string) => {
        if (view === 'search') {
            onOpenSearch();
        } else if (view === 'help') {
            onOpenHelp();
        } else {
            setActiveView(view);
        }
        onClose();
    }
    
    const menuItems = [...allMenuItems];
    if (isAdmin) {
        menuItems.push({ view: 'admin_panel', label: 'Painel Admin', icon: <ShieldCheck className="w-5 h-5" /> });
    }

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"></div>
            <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 z-50 md:hidden">
                 <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100 mb-2 px-2">Mais Opções</h3>
                 <ul className="grid grid-cols-3 gap-2">
                    {menuItems.map(item => (
                         <li key={item.view}>
                             <button
                               onClick={() => handleSelect(item.view)}
                               className={`w-full flex flex-col items-center gap-2 p-3 rounded-lg text-sm font-semibold transition-colors ${
                                 activeView === item.view
                                   ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300'
                                   : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                               }`}
                             >
                               {item.icon}
                               <span>{item.label}</span>
                             </button>
                           </li>
                    ))}
                 </ul>
            </div>
        </>
    )
}


const MobileMenuView: React.FC<MobileMenuViewProps> = ({ activeView, setActiveView, isAdmin, onOpenSearch, onOpenHelp }) => {
    const [isMoreMenuOpen, setMoreMenuOpen] = React.useState(false);

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30 md:hidden">
                {mainItems.map(item => (
                    <NavItem key={item.view} {...item} activeView={activeView} onClick={setActiveView} />
                ))}
                <button
                    onClick={() => setMoreMenuOpen(true)}
                    className="flex flex-col items-center justify-center gap-1 p-2 flex-grow text-gray-500 dark:text-slate-400 hover:text-pink-500"
                >
                    <MoreHorizontal className="w-6 h-6" />
                    <span className="text-xs">Mais</span>
                </button>
            </nav>
            {isMoreMenuOpen && <MoreMenuModal onClose={() => setMoreMenuOpen(false)} isAdmin={isAdmin} activeView={activeView} setActiveView={setActiveView} onOpenSearch={onOpenSearch} onOpenHelp={onOpenHelp} />}
        </>
    );
};

export default MobileMenuView;