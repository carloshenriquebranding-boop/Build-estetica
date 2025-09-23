
import * as React from 'react';
import { useDrag } from 'react-dnd';
import type { Client, ClientTask } from '../types.ts';
import { Phone } from './icons/Phone.tsx';
import { Mail } from './icons/Mail.tsx';
import { ListChecks } from './icons/ListChecks.tsx';
import { getClientColor } from '../utils/colors.ts';

interface ClientCardProps {
  client: Client;
  tasks: ClientTask[];
  onCardClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, tasks, onCardClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CLIENT_CARD',
    item: { id: client.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const ref = React.useRef<HTMLDivElement>(null);
  drag(ref);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const color = getClientColor(client.id);

  return (
    <div
      ref={ref}
      onClick={onCardClick}
      className={`relative rounded-xl shadow-md border dark:border-slate-700/50 cursor-pointer border-l-4 ${color.border500} ${color.bg50} dark:bg-slate-800 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDragging ? 'opacity-50 scale-95 rotate-3' : 'opacity-100'}`}
    >
        <div className={`absolute inset-0 rounded-xl ${color.bg50} dark:bg-slate-800 opacity-50 dark:opacity-100`}></div>
        <div className="relative p-4">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 pr-4">{client.name}</h3>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color.bg100} dark:bg-slate-700 ${color.text900} dark:text-slate-300`}>
                    {client.treatment}
                </span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    <span>{client.phone}</span>
                </div>
                {client.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                    </div>
                )}
            </div>
        </div>
        {totalTasks > 0 && (
            <div className="relative px-4 py-3 bg-white/50 dark:bg-slate-800/50 rounded-b-lg border-t dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium">
                        <ListChecks className="w-4 h-4" />
                        <span>Progresso</span>
                    </div>
                    <span className="font-semibold">{completedTasks}/{totalTasks}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                    <div className={`${color.bg500} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ClientCard;