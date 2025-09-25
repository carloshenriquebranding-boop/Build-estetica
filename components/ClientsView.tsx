import * as React from 'react';
import type { Client, Stage, Service } from '../types.ts';
import AddClientModal from './AddClientModal.tsx';
import { Plus, ChevronsUpDown, Mail, Phone, Stethoscope } from './icons/index.ts';
import { getClientColor } from '../utils/colors.ts';
import ViewHeader from './ViewHeader.tsx';

type SortKey = keyof Client | 'stage_title';
type SortDirection = 'asc' | 'desc';

interface ClientsViewProps {
  clients: Client[];
  stages: Stage[];
  services: Service[];
  onAddClient: (clientData: Omit<Client, 'id' | 'stage_id' | 'user_id' | 'created_at'>) => Promise<Client | undefined>;
  onOpenEditClientModal: (client: Client) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const getStageChipColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
        indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
        teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colorMap[colorName] || colorMap['gray'];
}

const ClientsView: React.FC<ClientsViewProps> = ({ 
  clients, stages, services, onAddClient, onOpenEditClientModal, showBackButton, onBack
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'name', direction: 'asc'});
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  
  const stagesById = React.useMemo(() => new Map(stages.map(s => [s.id, { title: s.title, color: s.color }])), [stages]);

  const filteredClients = React.useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.treatment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);
  
  const sortedClients = React.useMemo(() => {
    let sortableItems = [...filteredClients];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'stage_title') {
          aValue = stagesById.get(a.stage_id)?.title || '';
          bValue = stagesById.get(b.stage_id)?.title || '';
        } else {
          aValue = a[sortConfig.key as keyof Client];
          bValue = b[sortConfig.key as keyof Client];
        }

        // Handle case-insensitive sorting for strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue, 'pt-BR', { sensitivity: 'base' });
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        // Fallback for other types (numbers, etc.)
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredClients, sortConfig, stagesById]);


  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAddClientSubmit = async (clientData: Omit<Client, 'id' | 'stage_id' | 'user_id' | 'created_at'>) => {
    setIsSubmitting(true);
    await onAddClient(clientData);
    setIsSubmitting(false);
    setAddModalOpen(false);
  };

  const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  return (
    <div>
      <ViewHeader title="Clientes" showBackButton={showBackButton} onBack={onBack}>
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500"
          />
          <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
      </ViewHeader>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedClients.map(client => {
            const stageInfo = stagesById.get(client.stage_id);
            const color = getClientColor(client.id);

            return (
                <div 
                    key={client.id} 
                    onClick={() => onOpenEditClientModal(client)}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border dark:border-slate-700"
                >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 flex-shrink-0">
                        {client.avatar_url ? (
                            <img src={client.avatar_url} alt={client.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className={`w-full h-full rounded-full flex items-center justify-center ${color.bg500}`}>
                                {getClientInitials(client.name)}
                            </div>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg truncate w-full">{client.name}</h3>
                    {stageInfo && (
                        <span className={`mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStageChipColor(stageInfo.color)}`}>
                            {stageInfo.title}
                        </span>
                    )}
                    <div className="mt-4 pt-4 border-t w-full dark:border-slate-700 space-y-2 text-sm text-gray-600 dark:text-slate-400">
                         <div className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{client.phone}</span>
                        </div>
                        {client.email && (
                             <div className="flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{client.email}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2">
                            <Stethoscope className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{client.treatment}</span>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
      {sortedClients.length === 0 && <p className="text-center text-gray-500 dark:text-slate-400 py-12">Nenhum cliente encontrado.</p>}

      {isAddModalOpen && (
        <AddClientModal
          stages={stages}
          services={services}
          onClose={() => setAddModalOpen(false)}
          onAddClient={handleAddClientSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ClientsView;