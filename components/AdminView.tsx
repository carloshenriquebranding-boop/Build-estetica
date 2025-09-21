import * as React from 'react';
import { MOCK_ADMIN_USERS } from '../utils/mockData.ts'; // We'll use this for demo
import type { UserProfile } from '../types.ts';
import { Pencil, ArrowLeft } from './icons/index.ts';
import { ShieldAlert } from './icons/ShieldAlert.tsx';
import { ShieldCheck } from './icons/ShieldCheck.tsx';
import EditSubscriptionModal from './EditSubscriptionModal.tsx';

interface AdminViewProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ showBackButton, onBack }) => {
  const [users, setUsers] = React.useState<UserProfile[]>(MOCK_ADMIN_USERS);
  const [editingUser, setEditingUser] = React.useState<UserProfile | null>(null);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
    alert(`Usuário ${updatedUser.name} atualizado.`);
  };

  const getStatusChip = (status: UserProfile['subscription_status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Ativo</span>;
      case 'pending_payment':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Pendente</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Expirado</span>;
       case 'canceled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Cancelado</span>;
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        {showBackButton && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Painel do Administrador</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 p-2 mb-2">Gerenciamento de Usuários</h2>
        <table className="w-full text-sm text-left text-gray-600 dark:text-slate-300">
          <thead className="text-xs text-gray-700 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">Usuário</th>
              <th scope="col" className="px-6 py-3">Status da Conta</th>
              <th scope="col" className="px-6 py-3">Status da Assinatura</th>
              <th scope="col" className="px-6 py-3">Expira em</th>
              <th scope="col" className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  {user.is_active ? (
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400"><ShieldCheck className="w-4 h-4"/> Ativa</span>
                  ) : (
                     <span className="flex items-center gap-2 text-red-600 dark:text-red-500"><ShieldAlert className="w-4 h-4"/> Inativa</span>
                  )}
                </td>
                <td className="px-6 py-4">{getStatusChip(user.subscription_status)}</td>
                <td className="px-6 py-4">{user.subscription_expires_at ? new Date(user.subscription_expires_at).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => setEditingUser(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                        <Pencil className="w-4 h-4" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditSubscriptionModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </>
  );
};

export default AdminView;