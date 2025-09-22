import * as React from 'react';
import type { Transaction, Client, Service } from '../types.ts';
import TransactionModal from './TransactionModal.tsx';
import { Pencil, Trash, DollarSign, Plus, Bell, ArrowUpCircle, ArrowDownCircle } from './icons/index.ts';
import ViewHeader from './ViewHeader.tsx';

const StatCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; color: 'green' | 'red' | 'blue' }> = ({ title, amount, icon, color }) => {
  const colorClasses = {
    green: 'text-green-500 dark:text-green-400',
    red: 'text-red-500 dark:text-red-400',
    blue: 'text-blue-500 dark:text-blue-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
        <div className={colorClasses[color]}>{icon}</div>
      </div>
      <p className={`text-3xl font-bold text-gray-800 dark:text-slate-100 mt-2`}>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
    </div>
  );
};

const StatusChip: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Pago</span>;
      case 'pending':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Pendente</span>;
      case 'overdue':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Vencido</span>;
      default:
        return null;
    }
};

interface FinancialViewProps {
  transactions: Transaction[];
  clients: Client[];
  services: Service[];
  onSave: (data: Omit<Transaction, 'id'> & { id?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const FinancialView: React.FC<FinancialViewProps> = ({ transactions, clients, services, onSave, onDelete, showBackButton, onBack }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [remindersEnabled, setRemindersEnabled] = React.useState(true);
  const [reminderDays, setReminderDays] = React.useState(3); // For pending before due date
  const [overdueReminderDays, setOverdueReminderDays] = React.useState(5); // For overdue every X days

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const scheduledReminders = React.useMemo(() => {
    if (!remindersEnabled) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return transactions
      .filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'overdue'))
      .map(t => {
        let reminderDate: Date | null = null;
        const dueDate = new Date(t.date);
        
        if (t.status === 'pending' && dueDate > today) {
           reminderDate = new Date(dueDate);
           reminderDate.setDate(reminderDate.getDate() - reminderDays);
        } else if (t.status === 'overdue') {
            reminderDate = new Date(); // In a real scenario, this would check the last reminder date
            reminderDate.setDate(reminderDate.getDate() + overdueReminderDays);
        }

        if (reminderDate && reminderDate >= today) {
            return {
                transaction: t,
                clientName: clients.find(c => c.id === t.client_id)?.name || 'N/A',
                reminderDate,
            };
        }
        return null;
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a,b) => a.reminderDate.getTime() - b.reminderDate.getTime());
  }, [transactions, clients, remindersEnabled, reminderDays, overdueReminderDays]);


  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'> & { id?: string }) => {
    await onSave(transactionData);
    setModalOpen(false);
    setEditingTransaction(null);
  };
  
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
        await onDelete(id);
    }
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };
  
  const handleOpenModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const TransactionTypeChip: React.FC<{type: 'income' | 'expense'}> = ({ type }) => {
    if (type === 'income') {
        return <span className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Receita</span>
    }
    return <span className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Despesa</span>
  }

  return (
    <div>
      <ViewHeader title="Financeiro" showBackButton={showBackButton} onBack={onBack}>
        <button onClick={handleOpenModal} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
          <Plus className="w-5 h-5" />
          Adicionar Transação
        </button>
      </ViewHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Receita Total" amount={totalIncome} icon={<ArrowUpCircle className="w-6 h-6" />} color="green" />
        <StatCard title="Despesa Total" amount={totalExpenses} icon={<ArrowDownCircle className="w-6 h-6" />} color="red" />
        <StatCard title="Saldo" amount={balance} icon={<DollarSign className="w-6 h-6" />} color="blue" />
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Lembretes Automáticos de Pagamento</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Configure o envio de lembretes para cobranças pendentes.</p>
            </div>
            <label htmlFor="toggle-reminders" className="flex items-center cursor-pointer">
              <div className="relative">
                <input id="toggle-reminders" type="checkbox" className="sr-only" checked={remindersEnabled} onChange={() => setRemindersEnabled(!remindersEnabled)} />
                <div className="block bg-gray-200 dark:bg-slate-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${remindersEnabled ? 'transform translate-x-6 !bg-pink-500' : ''}`}></div>
              </div>
            </label>
        </div>
        {remindersEnabled && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t dark:border-slate-700">
                <div>
                    <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Lembrar pagamentos pendentes</label>
                    <div className="flex items-center mt-1">
                        <input type="number" id="reminderDays" value={reminderDays} onChange={e => setReminderDays(parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm"/>
                        <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">dias antes do vencimento.</span>
                    </div>
                </div>
                 <div>
                    <label htmlFor="overdueReminderDays" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Lembrar pagamentos vencidos</label>
                    <div className="flex items-center mt-1">
                        <span className="mr-2 text-sm text-gray-500 dark:text-slate-400">A cada</span>
                        <input type="number" id="overdueReminderDays" value={overdueReminderDays} onChange={e => setOverdueReminderDays(parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm"/>
                        <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">dias.</span>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      {remindersEnabled && scheduledReminders.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 p-2 mb-2">Lembretes Agendados</h2>
              <ul className="space-y-2">
                  {scheduledReminders.map(r => (
                      <li key={r.transaction.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-full text-pink-600 dark:text-pink-400"><Bell className="w-5 h-5"/></div>
                          <div className="flex-grow">
                              <p className="font-semibold text-gray-700 dark:text-slate-200">
                                Lembrete para <span className="text-pink-600 dark:text-pink-400">{r.clientName}</span> sobre {r.transaction.description}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                  Será enviado em: {r.reminderDate.toLocaleDateString('pt-BR')}
                              </p>
                          </div>
                          <div className="text-right">
                            <StatusChip status={r.transaction.status} />
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
      )}


      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 p-2 mb-2">Histórico de Transações</h2>

        {/* Tabela para Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-slate-300">
            <thead className="text-xs text-gray-700 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Descrição</th>
                <th scope="col" className="px-6 py-3">Tipo</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Valor</th>
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map(t => (
                <tr key={t.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.description}</td>
                  <td className="px-6 py-4"><TransactionTypeChip type={t.type}/></td>
                  <td className="px-6 py-4">{t.type === 'income' ? <StatusChip status={t.status} /> : '-'}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${t.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEditTransaction(t)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                          <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTransaction(t.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                          <Trash className="w-4 h-4" />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lista de Cards para Mobile */}
        <div className="md:hidden space-y-3">
            {sortedTransactions.map(t => (
                <div key={t.id} className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border-l-4 ${t.type === 'income' ? 'border-green-500' : 'border-red-500'} flex justify-between items-start`}>
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-900 dark:text-white pr-2">{t.description}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                        <div className="flex gap-2">
                           <TransactionTypeChip type={t.type}/>
                           {t.type === 'income' && <StatusChip status={t.status} />}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                        <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                           {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <div className="mt-2 flex justify-end gap-1">
                            <button onClick={() => handleEditTransaction(t)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTransaction(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {transactions.length === 0 && <p className="text-center text-gray-500 dark:text-slate-400 py-8">Nenhuma transação registrada.</p>}
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => { setModalOpen(false); setEditingTransaction(null); }}
          onSave={handleSaveTransaction}
          clients={clients}
          services={services}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default FinancialView;