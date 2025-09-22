import * as React from 'react';
import type { UserProfile } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { INPUT_CLASSES } from '../constants.ts';

interface EditSubscriptionModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (user: UserProfile) => void;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ user, onClose, onSave }) => {
  const [isActive, setIsActive] = React.useState(user.is_active);
  const [status, setStatus] = React.useState(user.subscription_status);
  const [expiresAt, setExpiresAt] = React.useState(user.subscription_expires_at ? new Date(user.subscription_expires_at).toISOString().split('T')[0] : '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSave({
        ...user,
        is_active: isActive,
        subscription_status: status,
        subscription_expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Editar Usuário</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{user.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Status da Conta</label>
              <select id="is_active" value={String(isActive)} onChange={e => setIsActive(e.target.value === 'true')} className={INPUT_CLASSES}>
                <option value="true">Ativa</option>
                <option value="false">Inativa</option>
              </select>
            </div>
            <div>
              <label htmlFor="subscription_status" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Status da Assinatura</label>
              <select id="subscription_status" value={status} onChange={e => setStatus(e.target.value as UserProfile['subscription_status'])} className={INPUT_CLASSES}>
                <option value="active">Ativo</option>
                <option value="pending_payment">Pagamento Pendente</option>
                <option value="expired">Expirado</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
            <div>
              <label htmlFor="subscription_expires_at" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Data de Expiração</label>
              <input type="date" id="subscription_expires_at" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={INPUT_CLASSES} />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-32 disabled:bg-pink-300">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionModal;