import * as React from 'react';
import type { Service } from '../types.ts';
import { Plus, Loader2, Pencil, Trash, ArrowLeft } from './icons/index.ts';

interface ServicesViewProps {
  services: Service[];
  onAdd: (data: Omit<Service, 'id'>) => Promise<void>;
  onUpdate: (data: Service) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ServicesView: React.FC<ServicesViewProps> = ({ services, onAdd, onUpdate, onDelete, showBackButton, onBack }) => {
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serviceName, setServiceName] = React.useState('');
  const [servicePrice, setServicePrice] = React.useState(0);
  const [serviceDescription, setServiceDescription] = React.useState('');

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServicePrice(service.price);
    setServiceDescription(service.description || '');
    setIsAdding(false);
  };
  
  const handleAddNew = () => {
    setIsAdding(true);
    setEditingService(null);
    setServiceName('');
    setServicePrice(0);
    setServiceDescription('');
  }

  const handleCancel = () => {
    setEditingService(null);
    setIsAdding(false);
    setServiceName('');
    setServicePrice(0);
    setServiceDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingService) {
        await onUpdate({ ...editingService, name: serviceName, price: servicePrice, description: serviceDescription });
    } else {
        await onAdd({ name: serviceName, price: servicePrice, description: serviceDescription });
    }

    setIsSubmitting(false);
    handleCancel();
  };
  
  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
        await onDelete(serviceId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            {showBackButton && (
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Serviços e Tratamentos</h1>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
          <Plus className="w-5 h-5" />
          Adicionar Serviço
        </button>
      </div>

      {(isAdding || editingService) && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome do Serviço</label>
                <input
                  type="text"
                  id="serviceName"
                  value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Preço (R$)</label>
                <input
                  type="number"
                  id="servicePrice"
                  value={servicePrice}
                  onChange={e => setServicePrice(parseFloat(e.target.value) || 0)}
                  required
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
            <div>
                <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Descrição do Serviço</label>
                <textarea
                  id="serviceDescription"
                  value={serviceDescription}
                  onChange={e => setServiceDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg w-28 flex justify-center items-center disabled:bg-pink-300">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
        <ul className="divide-y divide-gray-200 dark:divide-slate-700">
          {services.map(service => (
            <li key={service.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg">
              <div className="flex-grow pr-4">
                <p className="font-semibold text-gray-800 dark:text-slate-100">{service.name}</p>
                {service.description && (
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <p className="font-semibold text-gray-600 dark:text-slate-300">
                  {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(service)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServicesView;