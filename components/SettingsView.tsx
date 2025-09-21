import * as React from 'react';
import { Bell, Webhook, QrCode, Sun, Moon, ArrowLeft } from './icons/index.ts';
import WhatsappConnectModal from './WhatsappConnectModal.tsx';

type Theme = 'light' | 'dark';

interface SettingsViewProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const SettingCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ icon, title, description, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="text-pink-500 dark:text-pink-400 flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <div className="flex-shrink-0 flex items-center w-full sm:w-auto">
        {children}
      </div>
    </div>
  </div>
);

const SettingsView: React.FC<SettingsViewProps> = ({ theme, onThemeChange, showBackButton, onBack }) => {
  const [isWhatsappModalOpen, setWhatsappModalOpen] = React.useState(false);
  const [isWhatsappConnected, setIsWhatsappConnected] = React.useState(false);
  
  const handleConnectSuccess = () => {
    setIsWhatsappConnected(true);
    setWhatsappModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {showBackButton && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Configurações</h1>
      </div>
      <div className="space-y-6 max-w-4xl mx-auto">
        <SettingCard
          icon={<Sun className="w-8 h-8" />}
          title="Aparência"
          description="Personalize a aparência do sistema para modo claro ou escuro."
        >
          <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
            <button
              onClick={() => onThemeChange('light')}
              className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-500 shadow text-pink-600 dark:text-pink-300'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <Sun className="w-5 h-5" /> Claro
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-500 shadow text-pink-600 dark:text-pink-300'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <Moon className="w-5 h-5" /> Escuro
            </button>
          </div>
        </SettingCard>
        
        <SettingCard
          icon={<Bell className="w-8 h-8" />}
          title="Notificações"
          description="Gerencie como você recebe notificações."
        >
          <button className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
            Gerenciar
          </button>
        </SettingCard>
        
        <SettingCard
          icon={<QrCode className="w-8 h-8" />}
          title="Conexão com WhatsApp"
          description={isWhatsappConnected ? "Sua conta está conectada e pronta para enviar mensagens." : "Conecte sua conta do WhatsApp para automações."}
        >
          {isWhatsappConnected ? (
             <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">
                Desconectar
            </button>
          ) : (
            <button onClick={() => setWhatsappModalOpen(true)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
                Conectar
            </button>
          )}
        </SettingCard>

        <SettingCard
          icon={<Webhook className="w-8 h-8" />}
          title="Integrações e API"
          description="Conecte com outras ferramentas e acesse sua chave de API."
        >
           <button className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">
            Ver Opções
          </button>
        </SettingCard>
      </div>
      
      <WhatsappConnectModal 
        isOpen={isWhatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
      />
    </div>
  );
};

export default SettingsView;