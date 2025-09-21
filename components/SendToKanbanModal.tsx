
import * as React from 'react';
import type { Client, Stage, Service } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';

interface SendToKanbanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (clientData: Omit<Client, 'id' | 'user_id'>) => void;
  stages: Stage[];
  services: Service[];
  initialData: { name: string; phone: string };
}

const SendToKanbanModal: React.FC<SendToKanbanModalProps> = ({
  isOpen, onClose, onAddClient, stages, services, initialData
}) => {
  const [name, setName] = React.useState(initialData.name);
  const [phone, setPhone] = React.useState(initialData.phone);
  const [treatment, setTreatment] = React.useState(services[0]?.name || '');
  const [stageId, setStageId] = React.useState(stages[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async
    
    try {
      onAddClient({ name, phone, treatment, stage_id: stageId });
      onClose();
    } catch(error) {
      console.error("Error adding client from Omnichannel modal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Adicionar Cliente ao Funil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Telefone</label>
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
            </div>
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Serviço de Interesse</label>
              <select id="treatment" value={treatment} onChange={e => setTreatment(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500">
                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="stageId" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Enviar para o Estágio</label>
              <select id="stageId" value={stageId} onChange={e => setStageId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500">
                {stages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-32 disabled:bg-pink-300">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendToKanbanModal;