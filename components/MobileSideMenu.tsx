import * as React from 'react';
import type { UserProfile } from '../types.ts';
import { X, Home, LayoutGrid, Users, CalendarDays, MessageSquare, Briefcase, DollarSign, CheckSquare, FileText, FileSpreadsheet, UserCircle, Settings, ShieldCheck, LogOut, MoreHorizontal } from './icons/index.ts';

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  isAdmin: boolean;
  userProfile: UserProfile;
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
      className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
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
    { view: 'dashboard', label: 'Dashboard', icon: <Home className="w-6 h-6" /> },
    { view: 'kanban', label: 'Funil', icon: <LayoutGrid className="w-6 h-6" /> },
    { view: 'clients', label: 'Clientes', icon: <Users className="w-6 h-6" /> },
    { view: 'calendar', label: 'Agenda', icon: <CalendarDays className="w-6 h-6" /> },
    { view: 'omnichannel', label: 'Conversas', icon: <MessageSquare className="w-6 h-6" /> },
    { view: 'services', label: 'Serviços', icon: <Briefcase className="w-6 h-6" /> },
    { view: 'financial', label: 'Financeiro', icon: <DollarSign className="w-6 h-6" /> },
    { view: 'tasks', label: 'Tarefas', icon: <CheckSquare className="w-6 h-6" /> },
    { view: 'notes', label: 'Notas', icon: <FileText className="w-6 h-6" /> },
    { view: 'prescription', label: 'Prescrições', icon: <FileSpreadsheet className="w-6 h-6" /> },
    { view: 'budget', label: 'Orçamentos', icon: <FileText className="w-6 h-6" /> },
];

const MobileSideMenu: React.FC<MobileSideMenuProps> = ({ isOpen, onClose, activeView, setActiveView, isAdmin, userProfile }) => {
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
        onClose();
    };

    const handleLogout = () => window.location.reload();
    
    const userMenuItems = [
        { view: 'profile', label: 'Meu Perfil', icon: <UserCircle className="w-5 h-5" /> },
        { view: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
    ];
    if (isAdmin) {
        userMenuItems.push({ view: 'admin_panel', label: 'Painel Admin', icon: <ShieldCheck className="w-5 h-5" /> });
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div id="mobile-menu-title" className="text-2xl font-bold text-pink-500">EstéticaCRM</div>
                        <button onClick={onClose} aria-label="Fechar menu" className="p-2 -mr-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex-grow pr-2">
                        <ul className="space-y-1.5">
                            {menuItems.map(item => <NavItem key={item.view} {...item} activeView={activeView} onClick={handleNavigate} />)}
                        </ul>
                    </nav>
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
                </div>
            </aside>
        </>
    );
};

export default MobileSideMenu;