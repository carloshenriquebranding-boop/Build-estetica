

import * as React from 'react';
import type { Stage, Client, ClientTask, Service, Note } from '../types.ts';
import KanbanColumn from './KanbanColumn.tsx';
import AddStageColumn from './AddStageColumn.tsx';
import AddClientModal from './AddClientModal.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';
import ViewHeader from './ViewHeader.tsx';
import { Plus } from './icons/Plus.tsx';

interface KanbanBoardProps {
  stages: Stage[];
  clients: Client[];
  clientTasks: ClientTask[];
  services: Service[];
  notes: Note[];
  onNavigateToNotes: (searchTerm: string) => void;
  onClientStageChange: (clientId: string, newStageId: string) => Promise<void>;
  onReorderClient: (draggedClientId: string, targetClientId: string) => Promise<void>;
  onAddClient: (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'order'>, stageId: string) => Promise<Client | undefined>;
  onOpenEditClientModal: (client: Client) => void;
  onAddStage: (title: string) => Promise<void>;
  onUpdateStage: (stageId: string, updates: Partial<Omit<Stage, 'id'>>) => Promise<void>;
  onDeleteStage: (stageId: string) => Promise<void>;
  onAddClientTask: (clientId: string, title: string) => Promise<void>;
  onToggleClientTask: (taskId: string) => Promise<void>;
  onDeleteClientTask: (taskId: string) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const StageSwitcher: React.FC<{
    stages: Stage[];
    selectedStageId: string;
    onSelectStage: (stageId: string) => void;
}> = ({ stages, selectedStageId, onSelectStage }) => (
    <div className="mb-4 overflow-x-auto kanban-scroll">
        <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
            {stages.map(stage => (
                <button
                    key={stage.id}
                    onClick={() => onSelectStage(stage.id)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                        selectedStageId === stage.id
                        ? 'bg-white dark:bg-slate-500 shadow text-pink-600 dark:text-pink-300'
                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                >
                    {stage.title}
                </button>
            ))}
        </div>
    </div>
);


const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  stages, clients, clientTasks, services, notes, onNavigateToNotes,
  onClientStageChange, onReorderClient, onAddClient, onOpenEditClientModal, onAddStage,
  onUpdateStage, onDeleteStage, onAddClientTask, onToggleClientTask, onDeleteClientTask,
  showBackButton, onBack
}) => {
  const [isAddClientModalOpen, setAddClientModalOpen] = React.useState(false);
  const [stageToDelete, setStageToDelete] = React.useState<Stage | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [collapsedColumns, setCollapsedColumns] = React.useState<Set<string>>(new Set());
  const [selectedMobileStageId, setSelectedMobileStageId] = React.useState<string | null>(stages[0]?.id || null);

  React.useEffect(() => {
    if (stages.length > 0 && !selectedMobileStageId) {
      setSelectedMobileStageId(stages[0].id);
    }
  }, [stages, selectedMobileStageId]);


  const handleToggleCollapse = (stageId: string) => {
    setCollapsedColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(stageId)) {
            newSet.delete(stageId);
        } else {
            newSet.add(stageId);
        }
        return newSet;
    });
  };

  const handleAddClientSubmit = async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'order'>, stageId: string) => {
    setIsSubmitting(true);
    await onAddClient(clientData, stageId);
    setIsSubmitting(false);
    setAddClientModalOpen(false);
  };
   
  const handleOpenDeleteModal = (stage: Stage) => {
      setStageToDelete(stage);
  };

  const handleDeleteStageConfirm = async () => {
    if (!stageToDelete) return;

    const clientsInStage = clients.filter(c => c.stage_id === stageToDelete.id);
    if (clientsInStage.length > 0) {
        alert('Não é possível excluir uma coluna que contém clientes. Mova os clientes para outra coluna primeiro.');
        setStageToDelete(null);
        return;
    }
    
    setIsDeleting(true);
    await onDeleteStage(stageToDelete.id);
    setIsDeleting(false);
    setStageToDelete(null);
  };
  
  const getSortedStageClients = (stageId: string) => {
    return clients
      .filter(client => client.stage_id === stageId)
      .sort((a, b) => {
        // FIX: Added fallback sorting for when the 'order' property is missing from client data
        // due to the database schema not having the 'order' column.
        if (typeof a.order === 'number' && typeof b.order === 'number') {
            return a.order - b.order;
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  };
  
  const selectedStage = stages.find(s => s.id === selectedMobileStageId);
   
  return (
    <div className="flex flex-col h-full">
        <ViewHeader title="Funil de Clientes" showBackButton={showBackButton} onBack={onBack}>
          <button onClick={() => setAddClientModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Cliente</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </ViewHeader>
        
        {/* Mobile Stage Switcher */}
        <div className="md:hidden">
            {stages.length > 0 && selectedMobileStageId && <StageSwitcher stages={stages} selectedStageId={selectedMobileStageId} onSelectStage={setSelectedMobileStageId} />}
        </div>

        {/* Desktop Kanban Board */}
        <div className="hidden md:flex flex-grow items-start gap-6 overflow-x-auto pb-4 kanban-scroll">
            {stages.map(stage => {
                const stageClients = getSortedStageClients(stage.id);
                return (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        clients={stageClients}
                        clientTasks={clientTasks}
                        onDropClient={onClientStageChange}
                        onReorderClient={onReorderClient}
                        onOpenEditClientModal={onOpenEditClientModal}
                        onUpdateStage={onUpdateStage}
                        onDeleteStage={() => handleOpenDeleteModal(stage)}
                        isCollapsed={collapsedColumns.has(stage.id)}
                        onToggleCollapse={handleToggleCollapse}
                    />
                );
            })}
            <AddStageColumn onAddStage={onAddStage} />
        </div>
        
        {/* Mobile Single Column View */}
        <div className="md:hidden flex-grow overflow-y-auto pb-4">
             {selectedStage ? (
                 <KanbanColumn
                    key={selectedStage.id}
                    stage={selectedStage}
                    clients={getSortedStageClients(selectedStage.id)}
                    clientTasks={clientTasks}
                    onDropClient={onClientStageChange}
                    onReorderClient={onReorderClient}
                    onOpenEditClientModal={onOpenEditClientModal}
                    onUpdateStage={onUpdateStage}
                    onDeleteStage={() => handleOpenDeleteModal(selectedStage)}
                    isCollapsed={false} // Always expanded on mobile
                    onToggleCollapse={() => {}} // No collapse on mobile
                />
             ) : (
                <p className="text-center text-gray-500 dark:text-slate-400 mt-8">Nenhum estágio selecionado ou disponível.</p>
             )}
        </div>


        {isAddClientModalOpen && (
            <AddClientModal
                stages={stages}
                services={services}
                onClose={() => setAddClientModalOpen(false)}
                onAddClient={handleAddClientSubmit}
                isSubmitting={isSubmitting}
            />
        )}
        
        {stageToDelete && (
            <ConfirmationModal
                isOpen={!!stageToDelete}
                onClose={() => setStageToDelete(null)}
                onConfirm={handleDeleteStageConfirm}
                title="Excluir Coluna"
                isConfirming={isDeleting}
            >
                <p>Tem certeza que deseja excluir a coluna <span className="font-bold">{stageToDelete.title}</span>? Esta ação não pode ser desfeita.</p>
            </ConfirmationModal>
        )}
    </div>
  );
};

export default KanbanBoard;