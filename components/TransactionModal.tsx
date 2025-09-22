import * as React from 'react';
import type { Transaction, Client, Service } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { INPUT_CLASSES } from '../constants.ts';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id'> & { id?: string }) => void;
  clients: Client[];
  services: Service[];
  transaction: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, clients, services, transaction }) => {
  const [type, setType] = React.useState<'income' | 'expense'>(transaction?.type || 'income');
  const [amount, setAmount] = React.useState(transaction?.amount || 0);
  const [description, setDescription] = React.useState(transaction?.description || '');
  const [date, setDate] = React.useState(transaction?.date ? transaction.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [clientId, setClientId] = React.useState(transaction?.client_id || '');
  const [serviceId, setServiceId] = React.useState(transaction?.service_id || '');
  const [status, setStatus] = React.useState<Transaction['status']>(transaction?.status || 'paid');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      id: transaction?.id,
      type,
      amount,
      description,
      date: new Date(date),
      client_id: clientId || null,
      service_id: serviceId || null,
      status: type === 'income' ? status : 'paid',
    });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{transaction ? 'Editar' : 'Nova'} Transação</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tipo de Transação</label>
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <button type="button" onClick={() => setType('income')} className={`w-full py-2 rounded-md font-semibold ${type === 'income' ? 'bg-white dark:bg-slate-500 shadow text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-slate-300'}`}>Receita</button>
                    <button type="button" onClick={() => setType('expense')} className={`w-full py-2 rounded-md font-semibold ${type === 'expense' ? 'bg-white dark:bg-slate-500 shadow text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-slate-300'}`}>Despesa</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Valor (R$)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} required className={INPUT_CLASSES} />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Data</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className={INPUT_CLASSES} />
                </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Descrição</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className={INPUT_CLASSES} />
            </div>
            {type === 'income' && (
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Status do Pagamento</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as Transaction['status'])} className={INPUT_CLASSES}>
                      <option value="paid">Pago</option>
                      <option value="pending">Pendente</option>
                      <option value="overdue">Vencido</option>
                    </select>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Cliente (Opcional)</label>
                <select id="client_id" value={clientId} onChange={e => setClientId(e.target.value)} className={INPUT_CLASSES}>
                  <option value="">Nenhum</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Serviço (Opcional)</label>
                <select id="service_id" value={serviceId} onChange={e => setServiceId(e.target.value)} className={INPUT_CLASSES}>
                  <option value="">Nenhum</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-32 disabled:bg-pink-300">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;