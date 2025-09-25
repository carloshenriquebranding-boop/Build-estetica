import * as React from 'react';
import ViewHeader from './ViewHeader.tsx';
import { Webhook, KeyRound, BookText, Plus, Pencil, Trash, Copy, RefreshCw } from './icons/index.ts';
import WebhookModal from './WebhookModal.tsx';

type Webhook = {
  id: string;
  url: string;
  events: string[];
};

const Card: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700">
    <div className="flex items-start gap-4">
      <div className="text-pink-500 dark:text-pink-400 flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{description}</p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  </div>
);

const IntegrationsView: React.FC<{ showBackButton?: boolean; onBack?: () => void }> = ({ showBackButton, onBack }) => {
  const [apiKey, setApiKey] = React.useState('crm_live_sk_abc123xyz789...');
  const [webhooks, setWebhooks] = React.useState<Webhook[]>([
    { id: 'wh_1', url: 'https://hooks.n8n.io/webhook/123-abc-xyz', events: ['client.created', 'appointment.created'] },
  ]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editingWebhook, setEditingWebhook] = React.useState<Webhook | null>(null);

  const regenerateApiKey = () => {
    const newKey = `crm_live_sk_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    alert('Nova chave de API gerada!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };
  
  const handleSaveWebhook = (webhookData: Omit<Webhook, 'id'> & { id?: string }) => {
    if (webhookData.id) {
        setWebhooks(prev => prev.map(wh => wh.id === webhookData.id ? webhookData as Webhook : wh));
    } else {
        const newWebhook: Webhook = { ...webhookData, id: `wh_${Date.now()}` };
        setWebhooks(prev => [...prev, newWebhook]);
    }
    setModalOpen(false);
    setEditingWebhook(null);
  };
  
  const handleDeleteWebhook = (id: string) => {
      if (window.confirm('Tem certeza que deseja excluir este webhook?')) {
          setWebhooks(prev => prev.filter(wh => wh.id !== id));
      }
  }

  return (
    <div>
      <ViewHeader title="Automação & API" showBackButton={showBackButton} onBack={onBack} />
      <div className="max-w-4xl mx-auto space-y-8">
        <Card icon={<KeyRound className="w-6 h-6" />} title="Chave de API" description="Use esta chave para autenticar suas requisições na API do EstéticaCRM.">
          <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg flex items-center justify-between">
            <code className="text-sm text-gray-700 dark:text-slate-200 font-mono select-all">{apiKey}</code>
            <div className="flex gap-2">
                <button onClick={() => copyToClipboard(apiKey)} className="p-2 text-gray-500 hover:text-pink-600" title="Copiar"><Copy className="w-4 h-4" /></button>
                <button onClick={regenerateApiKey} className="p-2 text-gray-500 hover:text-pink-600" title="Regenerar Chave"><RefreshCw className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>

        <Card icon={<Webhook className="w-6 h-6" />} title="Webhooks" description="Receba notificações em tempo real sobre eventos que acontecem no seu CRM.">
          <div className="space-y-3">
            {webhooks.map(wh => (
              <div key={wh.id} className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-mono text-sm text-gray-800 dark:text-slate-200 truncate">{wh.url}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {wh.events.map(event => <span key={event} className="px-2 py-0.5 text-xs rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300">{event}</span>)}
                  </div>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => { setEditingWebhook(wh); setModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteWebhook(wh.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setEditingWebhook(null); setModalOpen(true); }} className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
            <Plus className="w-5 h-5" /> Adicionar Webhook
          </button>
        </Card>

        <Card icon={<BookText className="w-6 h-6" />} title="Documentação" description="Guia rápido para começar a usar a API e os webhooks.">
          <div>
            <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-100">Autenticação</h4>
            <p className="text-sm mb-2 text-gray-600 dark:text-slate-300">Para se autenticar, inclua sua chave de API no cabeçalho `Authorization` de cada requisição.</p>
            <pre className="bg-gray-100 dark:bg-slate-900 p-3 rounded-md text-sm"><code>Authorization: Bearer {'{sua_chave_de_api}'}</code></pre>
            
            <h4 className="font-bold mt-4 mb-2 text-gray-800 dark:text-slate-100">Exemplo de Payload do Webhook</h4>
            <p className="text-sm mb-2 text-gray-600 dark:text-slate-300">Quando um evento `client.created` é disparado, você receberá um payload JSON no seu endpoint com a seguinte estrutura:</p>
            <pre className="bg-gray-100 dark:bg-slate-900 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "event_type": "client.created",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "id": "client-1",
    "name": "Ana Carolina Souza",
    "phone": "(11) 98765-4321",
    "email": "ana.souza@email.com",
    "treatment": "Limpeza de Pele Profunda",
    "stage_id": "stage-1",
    "created_at": "2024-01-01T11:59:58Z"
  }
}`}
            </pre>
          </div>
        </Card>
      </div>

      {isModalOpen && (
        <WebhookModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveWebhook}
            webhook={editingWebhook}
        />
      )}
    </div>
  );
};

export default IntegrationsView;