
import * as React from 'react';
import type { Task, Client } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { INPUT_CLASSES } from '../constants.ts';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Updated `onSave` parameter type to omit database-generated fields.
  onSave: (taskData: Omit<Task, 'id' | 'completed' | 'user_id' | 'created_at'> & { id?: string }) => void;
  clients: Client[];
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, clients, task }) => {
  const [title, setTitle] = React.useState(task?.title || '');
  const [description, setDescription] = React.useState(task?.description || '');
  const [dueDate, setDueDate] = React.useState(task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
  const [clientId, setClientId] = React.useState(task?.client_id || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    // Fix: The submitted object now correctly matches the updated `onSave` prop type.
    await onSave({
      id: task?.id,
      title,
      description,
      due_date: dueDate || null,
      client_id: clientId || null,
    });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{task ? 'Editar' : 'Nova'} Tarefa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Título da Tarefa</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={INPUT_CLASSES} />
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Descrição (Opcional)</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={INPUT_CLASSES} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Data de Vencimento</label>
                    <input type="date" id="due_date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={INPUT_CLASSES} />
                </div>
                <div>
                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Associar ao Cliente</label>
                    <select id="client_id" value={clientId} onChange={e => setClientId(e.target.value)} className={INPUT_CLASSES}>
                      <option value="">Nenhum</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

export default TaskModal;
