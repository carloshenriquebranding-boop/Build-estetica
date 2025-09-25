import * as React from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import type { Client, ClientTask } from '../types.ts';
import { Phone } from './icons/Phone.tsx';
import { Mail } from './icons/Mail.tsx';
import { ListChecks } from './icons/ListChecks.tsx';
import { getClientColor } from '../utils/colors.ts';

interface DragItem {
  id: string;
  index: number;
  stage_id: string;
}

interface ClientCardProps {
  client: Client;
  tasks: ClientTask[];
  index: number;
  onCardClick: () => void;
  onReorderClient: (draggedClientId: string, targetClientId: string) => void;
}

const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const ClientCard: React.FC<ClientCardProps> = ({ client, tasks, index, onCardClick, onReorderClient }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any }>({
    accept: 'CLIENT_CARD',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragStageId = item.stage_id;
      const hoverStageId = client.stage_id;

      // Don't replace items with themselves or items in other columns
      if (dragIndex === hoverIndex || dragStageId !== hoverStageId) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onReorderClient(item.id, client.id);

      // Note: we're mutating the monitor item here for performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'CLIENT_CARD',
    item: (): DragItem => ({ id: client.id, index, stage_id: client.stage_id }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  
  drag(drop(ref));

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const color = getClientColor(client.id);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      onClick={onCardClick}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md border dark:border-slate-700/50 cursor-grab group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="relative p-4">
          <div className="flex items-start gap-4">
              {client.avatar_url ? (
                  <img src={client.avatar_url} alt={client.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${color.bg500}`}>
                      {getClientInitials(client.name)}
                  </div>
              )}
              <div className="flex-grow">
                  <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 pr-2">{client.name}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color.bg100} dark:bg-slate-700 ${color.text900} dark:text-slate-300 whitespace-nowrap`}>
                          {client.treatment}
                      </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
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