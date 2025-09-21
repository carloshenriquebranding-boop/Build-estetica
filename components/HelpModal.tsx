import * as React from 'react';
import { X } from './icons/X.tsx';
import { Home, LayoutGrid, Users, CalendarDays, MessageSquare, DollarSign } from './icons/index.ts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-pink-500 dark:text-pink-400 mt-1">{icon}</div>
        <div>
            <h3 className="font-bold text-gray-800 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">{children}</p>
        </div>
    </div>
);


const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Como Usar o CRM</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
            <HelpSection icon={<Home className="w-6 h-6" />} title="Dashboard">
                Sua visão geral. Acompanhe métricas importantes como total de clientes, próximos agendamentos, receita e tarefas pendentes.
            </HelpSection>
            <HelpSection icon={<LayoutGrid className="w-6 h-6" />} title="Funil (Kanban)">
                Gerencie o fluxo dos seus clientes. Arraste e solte os cards entre as colunas para atualizar o estágio de cada um. Clique em um card para ver mais detalhes.
            </HelpSection>
            <HelpSection icon={<Users className="w-6 h-6" />} title="Clientes">
                 Veja uma lista completa de todos os seus clientes. Adicione novos, edite informações e pesquise contatos existentes.
            </HelpSection>
            <HelpSection icon={<CalendarDays className="w-6 h-6" />} title="Agenda">
                Visualize e gerencie seus agendamentos nos formatos de mês, semana ou dia. Arraste agendamentos para remarcar e clique em um horário para criar um novo.
            </HelpSection>
             <HelpSection icon={<MessageSquare className="w-6 h-6" />} title="Conversas (Omnichannel)">
                Centralize suas conversas do WhatsApp. Responda clientes e envie contatos diretamente para o funil de vendas.
            </HelpSection>
            <HelpSection icon={<DollarSign className="w-6 h-6" />} title="Financeiro">
                Controle suas finanças. Registre receitas e despesas para manter o saldo da sua clínica sempre atualizado.
            </HelpSection>
        </div>
         <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;