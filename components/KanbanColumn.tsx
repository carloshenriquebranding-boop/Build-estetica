import * as React from 'react';
import { useDrop } from 'react-dnd';
import type { Stage, Client, ClientTask } from '../types.ts';
import ClientCard from './ClientCard.tsx';
import { PlusCircle } from './icons/PlusCircle.tsx';
import { getColorClasses } from '../utils/colors.ts';
import ColumnOptionsDropdown from './ColumnOptionsDropdown.tsx';
import { Minimize2 } from './icons/Minimize2.tsx';
import { Maximize2 } from './icons/Maximize2.tsx';

interface KanbanColumnProps {
  stage: Stage;
  clients: Client[];
  clientTasks: ClientTask[];
  onDropClient: (clientId: string, newStageId: string) => void;
  onOpenAddClientModal: (stageId: string) => void;
  onOpenEditClientModal: (client: Client) => void;
  onUpdateStage: (stageId: string, updates: Partial<Omit<Stage, 'id'>>) => void;
  onDeleteStage: (stageId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: (stageId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
    stage, clients, clientTasks, onDropClient, onOpenAddClientModal, 
    onOpenEditClientModal, onUpdateStage, onDeleteStage, isCollapsed, onToggleCollapse
}) => {
  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CLIENT_CARD',
    drop: (item: { id: string }) => onDropClient(item.id, stage.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  drop(dropRef);
  
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [title, setTitle] = React.useState(stage.title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
    }
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== stage.title) {
      onUpdateStage(stage.id, { title: title.trim() });
    } else {
      setTitle(stage.title); // Revert if empty or unchanged
    }
    setIsEditingTitle(false);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitle(stage.title);
      setIsEditingTitle(false);
    }
  };

  const colorClasses = getColorClasses(stage.color);

  if (isCollapsed) {
    return (
        <div 
            onClick={() => onToggleCollapse(stage.id)}
            className={`w-16 flex-shrink-0 h-full bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-between p-4 border-t-4 ${colorClasses.border} cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200`}
            title={`Maximizar ${stage.title}`}
            role="button"
            aria-label={`Maximizar coluna ${stage.title}`}
        >
            <Maximize2 className="w-5 h-5 text-gray-500 dark:text-slate-400 flex-shrink-0" />
            <div 
                className="flex-grow flex items-center justify-center [writing-mode:vertical-rl] transform rotate-180 whitespace-nowrap text-center font-bold text-gray-600 dark:text-slate-300"
                style={{textOrientation: 'mixed'}}
            >
                {stage.title} ({clients.length})
            </div>
        </div>
    );
  }

  return (
    <div className={`w-full md:w-80 flex-shrink-0 flex flex-col rounded-xl shadow-md transition-all duration-300 ${isOver ? 'bg-pink-50' : 'bg-slate-100 dark:bg-slate-800'}`}>
      {/* Column Header */}
      <div className={`flex items-center justify-between p-3 rounded-t-xl border-t-4 ${colorClasses.border} ${colorClasses.bg} dark:bg-opacity-20`}>
        <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="w-full bg-transparent font-bold text-lg focus:outline-none focus:ring-1 focus:ring-pink-500 rounded-md px-1"
              />
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                className={`font-bold text-lg cursor-pointer ${colorClasses.text}`}
              >
                {stage.title}
              </h2>
            )}
            <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${colorClasses.text} bg-white/60 dark:bg-slate-900/50`}>
                {clients.length}
            </span>
        </div>
        <div className="flex items-center">
            <button onClick={() => onToggleCollapse(stage.id)} className="p-1 text-gray-400 hover:text-gray-700 hidden md:block">
                <Minimize2 className="w-5 h-5"/>
            </button>
            <ColumnOptionsDropdown stage={stage} onUpdateStage={onUpdateStage} onDeleteStage={onDeleteStage} />
        </div>
      </div>

      {/* Column Body */}
      <div ref={dropRef} className="flex-grow p-3 space-y-3 overflow-y-auto" style={{minHeight: '100px'}}>
        {clients.map(client => (
          <ClientCard 
            key={client.id}
            client={client}
            tasks={clientTasks.filter(task => task.client_id === client.id)}
            onCardClick={() => onOpenEditClientModal(client)}
            stageColor={stage.color}
          />
        ))}
         <button 
          onClick={() => onOpenAddClientModal(stage.id)}
          className="w-full flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Adicionar cliente</span>
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;