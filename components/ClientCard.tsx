
import * as React from 'react';
import { useDrag } from 'react-dnd';
import type { Client, ClientTask } from '../types.ts';
import { Phone } from './icons/Phone.tsx';
import { Mail } from './icons/Mail.tsx';
import { Stethoscope } from './icons/Stethoscope.tsx';
import { ListChecks } from './icons/ListChecks.tsx';
import { getColorClasses } from '../utils/colors.ts';

interface ClientCardProps {
  client: Client;
  tasks: ClientTask[];
  onCardClick: () => void;
  stageColor: string;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, tasks, onCardClick, stageColor }) => {
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
  
  const colorClasses = getColorClasses(stageColor);

  return (
    <div
      ref={ref}
      onClick={onCardClick}
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg cursor-pointer border-l-4 ${colorClasses.border} transition-all ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
    >
      <div className="p-4">
        <h3 className="font-bold text-gray-800 dark:text-slate-100">{client.name}</h3>
        <div className="mt-2 space-y-1.5 text-xs text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-gray-400" />
                <span>{client.treatment}</span>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{client.phone}</span>
            </div>
            {client.email && (
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{client.email}</span>
                </div>
            )}
        </div>
      </div>
      {totalTasks > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-700/50 rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4" />
                    <span>Progresso</span>
                </div>
                <span>{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5 mt-1">
                <div className={`${colorClasses.bg.replace('-200', '-500')} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClientCard;
