
import * as React from 'react';
import type { Client, Stage } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { INPUT_CLASSES } from '../constants.ts';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: Stage[];
  onClientCreated: (client: Client) => void;
  onAddNewClient: (clientData: Omit<Client, 'id' | 'user_id' | 'stage_id' | 'created_at'>, stageId: string) => Promise<Client | undefined>;
}

const NewBudgetModal: React.FC<NewClientModalProps> = ({
  isOpen, onClose, stages, onClientCreated, onAddNewClient
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [stageId, setStageId] = React.useState(stages[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !stageId) return;
    
    setIsSubmitting(true);
    try {
        const newClient = await onAddNewClient({ name, phone }, stageId);
        if (newClient) {
            onClientCreated(newClient);
        }
    } finally {
        setIsSubmitting(false);
        // Reset state for next time
        setName('');
        setPhone('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="modal-content bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Adicionar Novo Cliente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 dark:text-slate-400">Crie um novo cliente que será adicionado ao seu funil de vendas.</p>
                <div>
                    <label htmlFor="new-name" className="block text-sm font-medium">Nome do Cliente</label>
                    <input id="new-name" type="text" value={name} onChange={e => setName(e.target.value)} required className={INPUT_CLASSES} placeholder="Ex: Joana Silva"/>
                </div>
                <div>
                    <label htmlFor="new-phone" className="block text-sm font-medium">Telefone</label>
                    <input id="new-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={INPUT_CLASSES} placeholder="(99) 99999-9999" />
                </div>
                <div>
                    <label htmlFor="new-stage" className="block text-sm font-medium">Estágio Inicial no Funil</label>
                    <select id="new-stage" value={stageId} onChange={e => setStageId(e.target.value)} required className={INPUT_CLASSES}>
                        {stages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 font-semibold rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg w-32 flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Cliente'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NewBudgetModal;