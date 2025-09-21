import * as React from 'react';
import { ShieldAlert } from './icons/ShieldAlert.tsx';

const BlockedAccessView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 text-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8">
        <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Acesso Bloqueado</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-4">
          Sua conta foi desativada. Por favor, entre em contato com o suporte para regularizar sua situação e reativar o acesso.
        </p>
        <div className="mt-8">
            <a 
                href="mailto:suporte@esteticacrm.com" 
                className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600"
            >
                Contatar Suporte
            </a>
        </div>
      </div>
    </div>
  );
};

export default BlockedAccessView;
