import * as React from 'react';
import type { Task, Client } from '../types.ts';
import TaskModal from './TaskModal.tsx';
import { Plus, Pencil, Trash, ArrowLeft, Clock } from './icons/index.ts';

interface TasksViewProps {
  tasks: Task[];
  clients: Client[];
  onSave: (data: Omit<Task, 'id' | 'completed'> & { id?: string }) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const getTaskStatus = (task: Task) => {
    if (task.completed || !task.due_date) {
        return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    // Adjust for timezone offset before zeroing out time
    dueDate.setTime(dueDate.getTime() + dueDate.getTimezoneOffset() * 60 * 1000);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `Vencida há ${Math.abs(diffDays)} dia(s)`, color: 'text-red-500 dark:text-red-400' };
    }
    if (diffDays === 0) {
        return { text: 'Vence hoje', color: 'text-orange-500 dark:text-orange-400' };
    }
    if (diffDays === 1) {
        return { text: 'Vence amanhã', color: 'text-yellow-600 dark:text-yellow-500' };
    }
    return null; // Don't show for tasks due further out
};


const TasksView: React.FC<TasksViewProps> = ({ tasks, clients, onSave, onToggle, onDelete, showBackButton, onBack }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('pending');

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'completed'> & { id?: string }) => {
    await onSave(taskData);
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  
  const handleOpenModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  }
  
  const handleDeleteTask = async (id: string) => {
      if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
          await onDelete(id);
      }
  }

  const filteredTasks = React.useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        if(aDate === Infinity && bDate === Infinity) return 0;
        return aDate - bDate;
    });

    if (filter === 'pending') return sorted.filter(t => !t.completed);
    if (filter === 'completed') return sorted.filter(t => t.completed);
    return sorted;
  }, [tasks, filter]);

  const clientMap = React.useMemo(() => new Map(clients.map(c => [c.id, c.name])), [clients]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
            {showBackButton && (
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Tarefas</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
             {(['pending', 'completed', 'all'] as const).map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-white dark:bg-slate-500 shadow text-pink-600 dark:text-pink-300' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                    {{pending: 'Pendentes', completed: 'Concluídas', all: 'Todas'}[f]}
                </button>
             ))}
           </div>
          <button onClick={handleOpenModal} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
          <ul className="space-y-3">
            {filteredTasks.map(task => {
                const taskStatus = getTaskStatus(task);
                return (
                    <li key={task.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group">
                        <div className="flex items-start gap-3 flex-grow">
                            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="w-5 h-5 mt-1 text-pink-600 rounded focus:ring-pink-500 flex-shrink-0 cursor-pointer"/>
                            <div className="flex-grow">
                                <p className={`${task.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-200'}`}>{task.title}</p>
                                {task.description && <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{task.description}</p>}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-slate-400 mt-2">
                                    {task.due_date && <span>Vencimento: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>}
                                    {task.client_id && <span>Cliente: {clientMap.get(task.client_id)}</span>}
                                    {taskStatus && (
                                        <span className={`flex items-center gap-1 font-semibold ${taskStatus.color}`}>
                                            <Clock className="w-3 h-3"/>
                                            {taskStatus.text}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                         <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditTask(task)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><Pencil className="w-4 h-4"/></button>
                            <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash className="w-4 h-4"/></button>
                        </div>
                    </li>
                )
            })}
            {filteredTasks.length === 0 && <p className="text-center text-gray-500 py-8">Nenhuma tarefa aqui.</p>}
          </ul>
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTask}
          clients={clients}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default TasksView;