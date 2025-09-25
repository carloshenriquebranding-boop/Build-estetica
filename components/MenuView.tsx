import * as React from 'react';
import type { UserProfile } from '../types.ts';
import { Home, LayoutGrid, Users, CalendarDays, Briefcase, DollarSign, CheckSquare, FileText, MessageSquare, Settings, UserCircle, ShieldCheck, FileSpreadsheet, LogOut, MoreHorizontal, Search, HelpCircle, Megaphone, Webhook, Wand2 } from './icons/index.ts';
import { supabase } from '../services/supabaseClient.ts';
import FeaturePreviewTooltip from './FeaturePreviewTooltip.tsx';
import { FEATURE_PREVIEWS } from '../constants.ts';

interface MenuViewProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isAdmin: boolean;
  userProfile: UserProfile;
  onOpenSearch: () => void;
  onOpenHelp: () => void;
}

const disabledViews = new Set(['omnichannel', 'campaigns', 'ai_agents', 'integrations']);

const NavItem: React.FC<{
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: string;
  view: string;
  activeView: string;
  onClick: (view: string) => void;
}> = ({ icon, label, view, activeView, onClick }) => {
  
  const isDisabled = disabledViews.has(view);
  const preview = isDisabled ? FEATURE_PREVIEWS[view as keyof typeof FEATURE_PREVIEWS] : null;

  const button = (
    <button
      onClick={!isDisabled ? () => onClick(view) : (e) => e.preventDefault()}
      className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        activeView === view
          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
          : isDisabled
            ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
            : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
      }`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5 flex-shrink-0" })}
      <span>{label}</span>
    </button>
  );

  return (
    <li>
      {preview ? (
        <FeaturePreviewTooltip title={preview.title} description={preview.description}>
          {button}
        </FeaturePreviewTooltip>
      ) : (
        button
      )}
    </li>
  );
};


const menuItems = [
    // Active Items
    { view: 'dashboard', label: 'Dashboard', icon: <Home /> },
    { view: 'kanban', label: 'Funil', icon: <LayoutGrid /> },
    { view: 'clients', label: 'Clientes', icon: <Users /> },
    { view: 'calendar', label: 'Agenda', icon: <CalendarDays /> },
    { view: 'services', label: 'Serviços', icon: <Briefcase /> },
    { view: 'financial', label: 'Financeiro', icon: <DollarSign /> },
    { view: 'tasks', label: 'Tarefas', icon: <CheckSquare /> },
    { view: 'notes', label: 'Anotações', icon: <FileText /> },
    { view: 'prescription', label: 'Prescrições', icon: <FileSpreadsheet /> },
    { view: 'budget', label: 'Orçamentos', icon: <FileText /> },
    // Inactive Items (Grouped at the end)
    { view: 'omnichannel', label: 'Conversas', icon: <MessageSquare /> },
    { view: 'campaigns', label: 'Campanhas', icon: <Megaphone /> },
    { view: 'ai_agents', label: 'IA Agents', icon: <Wand2 /> },
    { view: 'integrations', label: 'Automação & API', icon: <Webhook /> },
];

const utilityItems = [
    { view: 'search', label: 'Busca Rápida', icon: <Search /> },
    { view: 'help', label: 'Ajuda & Suporte', icon: <HelpCircle /> },
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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        }
        // onAuthStateChange in App.tsx will handle the state transition
    };

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
        <aside className="w-64 bg-white dark:bg-slate-900 flex-col p-4 border-r border-stone-200 dark:border-slate-800 hidden md:flex">
            <div className="text-2xl font-bold font-display tracking-tight text-pink-500 mb-8 px-2">EstéticaCRM</div>
            <nav className="flex-grow flex flex-col overflow-y-auto pr-2 -mr-2">
                <ul className="space-y-1.5">
                    {menuItems.map(item => (
                        <NavItem key={item.view} {...item} activeView={activeView} onClick={handleItemClick} />
                    ))}
                </ul>
                <div className="my-4 h-px bg-stone-200 dark:bg-slate-700/50"></div>
                <ul className="space-y-1.5">
                     {utilityItems.map(item => (
                        <NavItem key={item.view} {...item} activeView={activeView} onClick={handleItemClick} />
                    ))}
                </ul>
            </nav>
            {/* User Profile Section */}
            <div className="relative mt-auto pt-4 border-t border-stone-200 dark:border-slate-800" ref={userMenuRef}>
                {isUserMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-slate-700 rounded-lg shadow-xl z-20 border border-stone-200 dark:border-slate-600">
                        <ul className="py-1">
                            {userMenuItems.map(item => (
                                <li key={item.view}>
                                    <button 
                                        onClick={() => handleNavigate(item.view)}
                                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-600"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                            <div className="my-1 h-px bg-stone-200 dark:bg-slate-600"></div>
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
                            src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.name.split(' ').join('+')}&background=ec4899&color=fff&font-size=0.33`}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left overflow-hidden">
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{userProfile.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile.business_name}</p>
                        </div>
                    </div>
                    <button onClick={() => setUserMenuOpen(o => !o)} className="p-2 -mr-2 text-slate-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default MenuView;