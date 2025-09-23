
import * as React from 'react';
import type { Client, Stage, Service, Note, ClientTask } from '../types.ts';
import AddClientModal from './AddClientModal.tsx';
import { Plus, ChevronsUpDown, Pencil, Phone, Stethoscope } from './icons/index.ts';
import { getClientColor } from '../utils/colors.ts';
import ViewHeader from './ViewHeader.tsx';

type SortKey = keyof Client | 'stage_title';
type SortDirection = 'asc' | 'desc';

interface ClientsViewProps {
  clients: Client[];
  stages: Stage[];
  services: Service[];
  // Fix: Changed return type and clientData type to match the handler in App.tsx.
  onAddClient: (clientData: Omit<Client, 'id' | 'stage_id' | 'user_id' | 'created_at'>) => Promise<Client | undefined>;
  onOpenEditClientModal: (client: Client) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({ 
  clients, stages, services, onAddClient, onOpenEditClientModal, showBackButton, onBack
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'name', direction: 'asc'});
  
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

      {/* Tabela para Desktop */}
      <div className="hidden md:block bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-slate-300">
          <thead className="text-xs text-gray-700 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-700">
            <tr>
              {['name', 'phone', 'treatment', 'stage_title'].map(key => (
                  <th key={key} scope="col" className="px-6 py-3">
                      <button onClick={() => requestSort(key as SortKey)} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-slate-100">
                        { {name: 'Nome', phone: 'Telefone', treatment: 'Tratamento', stage_title: 'Funil'}[key] }
                        <ChevronsUpDown className="w-3 h-3 text-gray-400"/>
                      </button>
                  </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedClients.map(client => (
              <tr key={client.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{client.name}</td>
                <td className="px-6 py-4">{client.phone}</td>
                <td className="px-6 py-4">{client.treatment}</td>
                <td className="px-6 py-4">{stagesById.get(client.stage_id)?.title || 'N/A'}</td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => onOpenEditClientModal(client)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                        <Pencil className="w-4 h-4" />
                    </button>
                </td>
              </tr>
            ))}
             {sortedClients.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-8">Nenhum cliente encontrado.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Lista de Cards para Mobile */}
      <div className="md:hidden space-y-3">
        {sortedClients.map(client => {
            const color = getClientColor(client.id);
            return (
                <div key={client.id} className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border-l-4 ${color.border500} flex items-center p-4`}>
                    <div className="flex-grow">
                        <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">{client.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-slate-400">
                             <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-gray-400" />
                                <span>{client.treatment}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                         <button onClick={() => onOpenEditClientModal(client)} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                            <Pencil className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )
        })}
        {sortedClients.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum cliente encontrado.</p>}
      </div>

      {isAddModalOpen && (
        <AddClientModal
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
