
import * as React from 'react';
import type { Client, Stage, Service, Task, Note, Appointment, Budget, Transaction } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { UserCircle, ClipboardList, NotebookText, Trash, Plus, CalendarDays, FileText, DollarSign, FileSpreadsheet } from './icons/index.ts';
import { INPUT_CLASSES } from '../constants.ts';

interface EditClientModalProps {
  client: Client;
  stages: Stage[];
  services: Service[];
  // Fix: Changed type from ClientTask[] to Task[] to match the data being passed from App.tsx.
  tasks: Task[];
  notes: Note[];
  appointments: Appointment[];
  budgets: Budget[];
  transactions: Transaction[];
  onClose: () => void;
  onSave: (clientData: Client) => void;
  onAddTask: (clientId: string, title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  isSubmitting: boolean;
  onNavigateToNotes: (searchTerm: string) => void;
}

type ActiveTab = 'info' | 'tasks' | 'appointments' | 'budgets' | 'notes' | 'financial';

const StatusChip: React.FC<{ status: Budget['status'] | Transaction['status'] }> = ({ status }) => {
    const styles: Record<string, string> = {
        // Budget
        draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        // Transaction
        paid: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
        overdue: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${styles[status]}`}>{status}</span>;
};

const EditClientModal: React.FC<EditClientModalProps> = ({
  client, stages, services, tasks, notes, appointments, budgets, transactions,
  onClose, onSave, onAddTask, onToggleTask, onDeleteTask, isSubmitting, onNavigateToNotes
}) => {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('info');
  const [formData, setFormData] = React.useState<Client>(client);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleAddTaskSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(newTaskTitle.trim()) {
          onAddTask(client.id, newTaskTitle.trim());
          setNewTaskTitle('');
      }
  };

  const handleViewNote = (noteTitle: string) => {
    onNavigateToNotes(noteTitle);
    onClose();
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Informações', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tarefas', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'appointments', label: 'Agendamentos', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'budgets', label: 'Orçamentos', icon: <FileText className="w-5 h-5" /> },
    { id: 'notes', label: 'Anotações & Prescrições', icon: <NotebookText className="w-5 h-5" /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
  ];

  const pendingTransactions = transactions.filter(t => t.status === 'pending' || t.status === 'overdue');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start py-8 md:items-center p-4">
      <div className="modal-content bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Dossiê do Cliente</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{client.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="border-b border-gray-200 dark:border-slate-700 flex-shrink-0 overflow-x-auto">
          <nav className="-mb-px flex gap-2 sm:gap-4 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-y-auto">
          {activeTab === 'info' && (
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Form fields from AddClientModal, adapted for editing */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome Completo</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={INPUT_CLASSES} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Telefone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className={INPUT_CLASSES} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                    <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className={INPUT_CLASSES} />
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Serviço/Tratamento</label>
                        <select name="treatment" id="treatment" value={formData.treatment} onChange={handleInputChange} className={INPUT_CLASSES}>
                            {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="stage_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Estágio do Funil</label>
                        <select name="stage_id" id="stage_id" value={formData.stage_id} onChange={handleInputChange} className={INPUT_CLASSES}>
                            {stages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Descrição</label>
                    <textarea name="description" id="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className={INPUT_CLASSES} />
                </div>
                 <div>
                    {/* Fix: Changed `notes` to `description` to match the Client type property for general notes/observations. */}
                    <label htmlFor="description-obs" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Observações</label>
                    <textarea name="description" id="description-obs" value={formData.description || ''} onChange={handleInputChange} rows={3} className={INPUT_CLASSES} />
                </div>
              </div>
               <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl flex-shrink-0">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">Cancelar</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-32 disabled:bg-pink-300">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
                  </button>
              </div>
            </form>
          )}

          {activeTab === 'tasks' && (
            <div className="p-6">
                <form onSubmit={handleAddTaskSubmit} className="flex gap-2 mb-4">
                    <input 
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Adicionar nova tarefa..."
                        className={INPUT_CLASSES}
                    />
                    <button type="submit" className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"><Plus className="w-5 h-5" /></button>
                </form>
                <ul className="space-y-2">
                    {tasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
                                <span className={`${task.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-700 dark:text-slate-200'}`}>{task.title}</span>
                            </label>
                            <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                <Trash className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                     {tasks.length === 0 && <p className="text-center text-gray-500 dark:text-slate-400 py-4">Nenhuma tarefa para este cliente.</p>}
                </ul>
            </div>
          )}
          
          {activeTab === 'appointments' && (
            <div className="p-6">
                 {appointments.length > 0 ? (
                    <ul className="space-y-3">
                        {appointments.map(appt => (
                            <li key={appt.id} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">{appt.treatment}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(appt.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-slate-400 py-4">Nenhum agendamento encontrado.</p>
                )}
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="p-6">
                {budgets.length > 0 ? (
                    <ul className="space-y-3">
                        {budgets.map(budget => (
                             <li key={budget.id} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">Orçamento #{budget.id.slice(-4)}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">Criado em: {new Date(budget.created_at).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-800 dark:text-slate-200">{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    <StatusChip status={budget.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-slate-400 py-4">Nenhum orçamento encontrado.</p>
                )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-700 dark:text-slate-200 mb-2 flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-pink-500"/> Prescrições</h3>
                 <ul className="space-y-3">
                    {notes.filter(n => n.type === 'prescription').map(note => (
                        <li key={note.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-md">
                            <button onClick={() => handleViewNote(note.title)} className="font-bold text-gray-800 dark:text-slate-200 hover:underline">{note.title}</button>
                        </li>
                    ))}
                    {notes.filter(n => n.type === 'prescription').length === 0 && <p className="text-sm text-center text-gray-500 dark:text-slate-400 py-2">Nenhuma prescrição.</p>}
                </ul>
              </div>
               <div>
                <h3 className="font-bold text-gray-700 dark:text-slate-200 mb-2 flex items-center gap-2"><NotebookText className="w-5 h-5 text-yellow-500"/> Anotações Gerais</h3>
                 <ul className="space-y-3">
                    {notes.filter(n => n.type !== 'prescription').map(note => (
                        <li key={note.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-md">
                           <button onClick={() => handleViewNote(note.title)} className="font-bold text-gray-800 dark:text-slate-200 hover:underline">{note.title}</button>
                        </li>
                    ))}
                     {notes.filter(n => n.type !== 'prescription').length === 0 && <p className="text-sm text-center text-gray-500 dark:text-slate-400 py-2">Nenhuma anotação.</p>}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="p-6">
                 {pendingTransactions.length > 0 ? (
                    <ul className="space-y-3">
                        {pendingTransactions.map(trans => (
                             <li key={trans.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">{trans.description}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">Vencimento: {new Date(trans.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-red-600 dark:text-red-400">{trans.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    <StatusChip status={trans.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-slate-400 py-4">Nenhuma pendência financeira.</p>
                )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditClientModal;
