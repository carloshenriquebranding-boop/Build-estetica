import * as React from 'react';
import { X, Loader2 } from './icons/index.ts';
import { INPUT_CLASSES } from '../constants.ts';

type Webhook = {
  id: string;
  url: string;
  events: string[];
};

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhookData: Omit<Webhook, 'id'> & { id?: string }) => void;
  webhook: Webhook | null;
}

const availableEvents = [
    { id: 'client.created', label: 'Cliente Criado' },
    { id: 'client.stage_changed', label: 'Estágio do Cliente Alterado' },
    { id: 'appointment.created', label: 'Agendamento Criado' },
    { id: 'appointment.updated', label: 'Agendamento Atualizado' },
    { id: 'transaction.paid', label: 'Transação Paga' },
];


const WebhookModal: React.FC<WebhookModalProps> = ({ isOpen, onClose, onSave, webhook }) => {
  const [url, setUrl] = React.useState(webhook?.url || '');
  const [selectedEvents, setSelectedEvents] = React.useState<Set<string>>(new Set(webhook?.events || []));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate async save
    await new Promise(res => setTimeout(res, 500));
    onSave({
        id: webhook?.id,
        url,
        events: Array.from(selectedEvents),
    });
    setIsSubmitting(false);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="modal-content bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{webhook ? 'Editar' : 'Adicionar'} Webhook</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-slate-300">URL do Endpoint</label>
              <input
                type="url"
                id="webhook-url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className={INPUT_CLASSES}
                placeholder="https://sua-automacao.com/webhook"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Eventos para Disparar</label>
                <div className="mt-2 space-y-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                    {availableEvents.map(event => (
                        <label key={event.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedEvents.has(event.id)}
                                onChange={() => handleEventToggle(event.id)}
                                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                            />
                            <span className="text-gray-700 dark:text-slate-200">{event.label}</span>
                        </label>
                    ))}
                </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-32 disabled:bg-pink-300 dark:disabled:bg-pink-800 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebhookModal;