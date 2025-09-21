import * as React from 'react';
import type { Client, Stage } from '../types.ts';
import { ArrowLeft, Mail, MessageSquare, Loader2, Send } from './icons/index.ts';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import TextEditorToolbar from './TextEditorToolbar.tsx';

interface CampaignsViewProps {
  clients: Client[];
  stages: Stage[];
  showBackButton?: boolean;
  onBack?: () => void;
}

const CampaignsView: React.FC<CampaignsViewProps> = ({ clients, stages, showBackButton, onBack }) => {
  const [activeTab, setActiveTab] = React.useState<'email' | 'whatsapp'>('email');
  
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '<p>Olá {{nome_cliente}}, ...</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 focus:outline-none flex-grow h-64 bg-white dark:bg-slate-700 rounded-b-md',
      },
    },
  });

  const handleSend = (channel: 'email' | 'whatsapp') => {
    alert(`Campanha de ${channel} enviada! (Simulação)`);
  };

  const EmailCampaign: React.FC = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Criar Campanha de Email</h2>
      <div>
        <label htmlFor="email-recipient" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Destinatários</label>
        <select id="email-recipient" className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500">
          <option>Todos os Clientes ({clients.length})</option>
          {stages.map(s => <option key={s.id}>Clientes em: {s.title}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Assunto</label>
        <input type="text" id="email-subject" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" placeholder="Assunto do seu email" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Conteúdo do Email</label>
        <div className="border border-gray-300 dark:border-slate-600 rounded-md">
            {editor && <TextEditorToolbar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => handleSend('email')} className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
          <Send className="w-5 h-5"/> Enviar Email
        </button>
      </div>
    </div>
  );
  
  const WhatsAppCampaign: React.FC = () => (
     <div className="space-y-4">
      <h2 className="text-xl font-bold">Criar Disparo de WhatsApp</h2>
       <div>
        <label htmlFor="wa-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome da Campanha</label>
        <input type="text" id="wa-name" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" placeholder="Ex: Promoção Dia das Mães" />
      </div>
      <div>
        <label htmlFor="wa-recipient" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Destinatários</label>
        <select id="wa-recipient" className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500">
          <option>Todos os Clientes ({clients.length})</option>
          {stages.map(s => <option key={s.id}>Clientes em: {s.title}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="wa-message" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Mensagem</label>
        <textarea id="wa-message" rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" defaultValue="Olá {{nome_cliente}}! Temos uma novidade especial para você..."></textarea>
        {/* Fix: Escaped curly braces to prevent JSX from interpreting them as an object literal. This ensures the literal string `{{nome_cliente}}` is rendered correctly. */}
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Use `{'{{nome_cliente}}'}` para personalizar a mensagem com o nome do cliente.</p>
      </div>
       <div className="flex justify-end">
        <button onClick={() => handleSend('whatsapp')} className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
          <Send className="w-5 h-5"/> Disparar Campanha
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {showBackButton && (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Campanhas</h1>
      </div>
      
      <div className="flex border-b-2 border-gray-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-4 transition-colors ${activeTab === 'email' ? 'border-pink-500 text-pink-600 dark:text-pink-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700'}`}
        >
          <Mail className="w-5 h-5" /> Email
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-4 transition-colors ${activeTab === 'whatsapp' ? 'border-pink-500 text-pink-600 dark:text-pink-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700'}`}
        >
          <MessageSquare className="w-5 h-5" /> WhatsApp
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        {activeTab === 'email' ? <EmailCampaign /> : <WhatsAppCampaign />}
      </div>
    </div>
  );
};

export default CampaignsView;