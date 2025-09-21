import * as React from 'react';
import type { UserProfile } from '../types.ts';
import { Home, LayoutGrid, Users, CalendarDays, Briefcase, DollarSign, CheckSquare, FileText, MessageSquare, Settings, UserCircle, ShieldCheck, FileSpreadsheet, LogOut, MoreHorizontal, Search, HelpCircle, Megaphone } from './icons/index.ts';

interface MenuViewProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isAdmin: boolean;
  userProfile: UserProfile;
  onOpenSearch: () => void;
  onOpenHelp: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  view: string;
  activeView: string;
  onClick: (view: string) => void;
}> = ({ icon, label, view, activeView, onClick }) => (
  <li>
    <button
      onClick={() => onClick(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
        activeView === view
          ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300'
          : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);

const menuItems = [
    { view: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { view: 'kanban', label: 'Funil', icon: <LayoutGrid className="w-5 h-5" /> },
    { view: 'clients', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { view: 'calendar', label: 'Agenda', icon: <CalendarDays className="w-5 h-5" /> },
    { view: 'omnichannel', label: 'Conversas', icon: <MessageSquare className="w-5 h-5" /> },
    { view: 'campaigns', label: 'Campanhas', icon: <Megaphone className="w-5 h-5" /> },
    { view: 'services', label: 'Serviços', icon: <Briefcase className="w-5 h-5" /> },
    { view: 'financial', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
    { view: 'tasks', label: 'Tarefas', icon: <CheckSquare className="w-5 h-5" /> },
    { view: 'notes', label: 'Notas', icon: <FileText className="w-5 h-5" /> },
    { view: 'prescription', label: 'Prescrições', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { view: 'budget', label: 'Orçamentos', icon: <FileText className="w-5 h-5" /> },
    { view: 'help', label: 'Ajuda', icon: <HelpCircle className="w-5 h-5" /> },
    { view: 'search', label: 'Busca', icon: <Search className="w-5 h-5" /> },
];

const MenuView: React.FC<MenuViewProps> = ({ activeView, setActiveView, isAdmin, userProfile, onOpenSearch, onOpenHelp }) => {
    const [isUserMenuOpen, setUserMenuOpen] = React.useState(false);
    const userMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (view: string) => {
        setActiveView(view);
        setUserMenuOpen(false);
    };

    const handleLogout = () => window.location.reload();

    const handleItemClick = (view: string) => {
      if (view === 'search') {
        onOpenSearch();
      } else if (view === 'help') {
        onOpenHelp();
      } else {
        setActiveView(view);
      }
    };
    
    const userMenuItems = [
        { view: 'profile', label: 'Meu Perfil', icon: <UserCircle className="w-5 h-5" /> },
        { view: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
    ];
    if (isAdmin) {
        userMenuItems.push({ view: 'admin_panel', label: 'Painel Admin', icon: <ShieldCheck className="w-5 h-5" /> });
    }

    return (
        <aside className="w-64 bg-white dark:bg-slate-800 flex-col p-4 border-r border-gray-200 dark:border-slate-700 hidden md:flex">
            <div className="text-2xl font-bold text-pink-500 mb-8 px-2">EstéticaCRM</div>
            <nav className="flex-grow overflow-y-auto pr-2">
                <ul className="space-y-1.5">
                    {menuItems.map(item => (
                        <NavItem key={item.view} {...item} activeView={activeView} onClick={handleItemClick} />
                    ))}
                </ul>
            </nav>
            {/* User Profile Section */}
            <div className="relative mt-auto border-t dark:border-slate-700 pt-4" ref={userMenuRef}>
                {isUserMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-slate-700 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-slate-600">
                        <ul className="py-1">
                            {userMenuItems.map(item => (
                                <li key={item.view}>
                                    <button 
                                        onClick={() => handleNavigate(item.view)}
                                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                            <div className="my-1 h-px bg-gray-200 dark:bg-slate-600"></div>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50"
                                >
                                    <LogOut className="w-5 h-5"/>
                                    <span>Sair</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img 
                            src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.name.split(' ').join('+')}&background=random`}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left overflow-hidden">
                            <p className="font-semibold text-sm text-gray-800 dark:text-slate-100 truncate">{userProfile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{userProfile.business_name}</p>
                        </div>
                    </div>
                    <button onClick={() => setUserMenuOpen(o => !o)} className="p-2 -mr-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default MenuView;