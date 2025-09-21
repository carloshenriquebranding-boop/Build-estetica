import * as React from 'react';
import { Building } from './icons/Building.tsx';
import { ShieldCheck } from './icons/ShieldCheck.tsx';

interface RoleSelectionViewProps {
  onSelect: (role: 'crm' | 'admin') => void;
}

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-100 mb-2">Bem-vindo(a), Administrador(a)</h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-10">Escolha qual painel você deseja acessar.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
                onClick={() => onSelect('crm')}
                className="group p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
                <Building className="w-16 h-16 mx-auto text-pink-500 mb-4 transition-transform group-hover:scale-110" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Acessar CRM</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Gerenciar clientes, agendamentos, finanças e mais.</p>
            </button>
            <button
                onClick={() => onSelect('admin')}
                className="group p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
                <ShieldCheck className="w-16 h-16 mx-auto text-blue-500 mb-4 transition-transform group-hover:scale-110" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Painel Admin</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Gerenciar usuários, assinaturas e configurações do sistema.</p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionView;
