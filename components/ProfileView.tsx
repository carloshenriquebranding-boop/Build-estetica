import * as React from 'react';
import type { UserProfile } from '../types.ts';
import { Loader2, Save, Camera, ArrowLeft } from './icons/index.ts';

interface ProfileViewProps {
  profile: UserProfile;
  onProfileUpdate: (data: UserProfile) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onProfileUpdate, showBackButton, onBack }) => {
  const [formData, setFormData] = React.useState<UserProfile>(profile);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onProfileUpdate(formData);
    setIsSubmitting(false);
    alert('Perfil atualizado com sucesso!');
  };
  
  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500";

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {showBackButton && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Meu Perfil</h1>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=128`}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-pink-200 dark:ring-pink-800"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-slate-700 text-white rounded-full hover:bg-slate-600 border-2 border-white dark:border-slate-800"
                title="Alterar foto"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{formData.name}</h2>
              <p className="text-gray-500 dark:text-slate-400">{formData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome Completo</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} />
            </div>
             <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome do Negócio</label>
              <input type="text" id="business_name" name="business_name" value={formData.business_name} onChange={handleInputChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="business_phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Telefone Comercial</label>
              <input type="tel" id="business_phone" name="business_phone" value={formData.business_phone || ''} onChange={handleInputChange} className={inputClasses} />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Endereço Comercial</label>
              <input type="text" id="business_address" name="business_address" value={formData.business_address || ''} onChange={handleInputChange} className={inputClasses} />
            </div>
          </div>

          <div className="pt-6 border-t dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-40 disabled:bg-pink-300"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Salvar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;