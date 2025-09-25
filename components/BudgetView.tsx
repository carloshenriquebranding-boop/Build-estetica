
import * as React from 'react';
import type { Budget, Client, Service, Stage, UserProfile, BudgetTemplateData, BudgetItem } from '../types.ts';
import { Plus } from './icons/index.ts';
import ViewHeader from './ViewHeader.tsx';
import TemplateCustomizerView from './TemplateCustomizerView.tsx'; // This is now the main editor component

interface BudgetViewProps {
  clients: Client[];
  services: Service[];
  stages: Stage[];
  userProfile: UserProfile;
  initialTemplateData: BudgetTemplateData;
  budgets: Budget[];
  onTemplateSave: (data: BudgetTemplateData) => Promise<void>;
  onSaveBudget: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<Budget>;
  onAddClient: (clientData: Omit<Client, 'id' | 'user_id' | 'stage_id' | 'created_at'>, stageId: string) => Promise<Client | undefined>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const BudgetView: React.FC<BudgetViewProps> = (props) => {
  const { budgets, clients, onBack, showBackButton, onSaveBudget } = props;
  const [view, setView] = React.useState<'list' | 'editor'>('list');
  const [activeBudget, setActiveBudget] = React.useState<Budget | null>(null);

  const handleStartNewBudget = () => {
    // Create a blank slate for a new budget
    const newBudget: Budget = {
      id: `new-${Date.now()}`,
      user_id: props.userProfile.id,
      client_id: '', // To be selected in the editor
      template_id: 'classic',
      items: [{ id: 'item-1', name: 'Novo Serviço', description: '', quantity: 1, unit_price: 0 }],
      total: 0,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setActiveBudget(newBudget);
    setView('editor');
  };

  const handleEditBudget = (budget: Budget) => {
    setActiveBudget(budget);
    setView('editor');
  };

  const handleBackToList = () => {
    setActiveBudget(null);
    setView('list');
  };

  const handleSave = async (budgetToSave: Budget) => {
    const savedBudget = await onSaveBudget({
        id: budgetToSave.id.startsWith('new-') ? undefined : budgetToSave.id,
        client_id: budgetToSave.client_id,
        template_id: budgetToSave.template_id,
        items: budgetToSave.items,
        total: budgetToSave.total,
        status: budgetToSave.status,
    });
    // The App.tsx component will update the main `budgets` list.
    handleBackToList();
    return savedBudget;
  };

  if (view === 'editor' && activeBudget) {
    return (
      <TemplateCustomizerView
        initialBudget={activeBudget}
        onSave={handleSave}
        onBack={handleBackToList}
        {...props}
      />
    );
  }

  return (
    <div>
      <ViewHeader title="Orçamentos" showBackButton={showBackButton} onBack={onBack}>
        <button onClick={handleStartNewBudget} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
          <Plus className="w-5 h-5" /> Novo Orçamento
        </button>
      </ViewHeader>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
        {budgets.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {budgets.map(budget => {
              const client = clients.find(c => c.id === budget.client_id);
              return (
                <li key={budget.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer" onClick={() => handleEditBudget(budget)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-slate-100">Orçamento para {client?.name || 'Cliente desconhecido'}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Total: {budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 capitalize">{budget.status}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <p className="font-semibold">Nenhum orçamento criado ainda.</p>
                <p className="text-sm mt-1">Clique em "Novo Orçamento" para começar.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BudgetView;