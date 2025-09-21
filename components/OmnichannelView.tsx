
import * as React from 'react';
import type { Stage, Service, WhatsappChat, WhatsappMessage, Client } from '../types.ts';
import { Loader2, Send, Paperclip, ArrowUpRightSquare, ArrowLeft } from './icons/index.ts';
import SendToKanbanModal from './SendToKanbanModal.tsx';

// Mock data for display purposes
const mockChats: WhatsappChat[] = [
    { id: 1, user_id: '1', jid: '5511999998888', name: 'Ana Silva', last_message_timestamp: new Date(Date.now() - 3600000).toISOString(), lastMessage: "Olá! Gostaria de agendar uma avaliação.", unreadCount: 2 },
    { id: 2, user_id: '1', jid: '5521888887777', name: 'Bruno Costa', last_message_timestamp: new Date(Date.now() - 86400000).toISOString(), lastMessage: "Confirmado! Até amanhã.", unreadCount: 0 },
    { id: 3, user_id: '1', jid: '5531977773333', name: 'Carla Dias', last_message_timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), lastMessage: "Qual o valor do microagulhamento?", unreadCount: 0 },
];
const mockMessages: { [key: string]: WhatsappMessage[] } = {
    '5511999998888': [
        { id: 1, user_id: '1', message_id: 'm1', chat_jid: '5511999998888', body: "Olá! Gostaria de agendar uma avaliação.", timestamp: new Date(Date.now() - 3600000).toISOString(), is_from_me: false },
        { id: 2, user_id: '1', message_id: 'm2', chat_jid: '5511999998888', body: "Claro, Ana! Qual seria o melhor dia para você?", timestamp: new Date(Date.now() - 3540000).toISOString(), is_from_me: true },
    ],
    '5521888887777': [
        { id: 3, user_id: '1', message_id: 'm3', chat_jid: '5521888887777', body: "Seu agendamento para amanhã às 15h está confirmado.", timestamp: new Date(Date.now() - 86460000).toISOString(), is_from_me: true },
        { id: 4, user_id: '1', message_id: 'm4', chat_jid: '5521888887777', body: "Confirmado! Até amanhã.", timestamp: new Date(Date.now() - 86400000).toISOString(), is_from_me: false },
    ],
    '5531977773333': [
         { id: 5, user_id: '1', message_id: 'm5', chat_jid: '5531977773333', body: "Qual o valor do microagulhamento?", timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), is_from_me: false },
    ]
};

const OmnichannelView: React.FC<{
  stages: Stage[];
  services: Service[];
  onAddClient: (clientData: Omit<Client, 'id' | 'user_id'>) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}> = ({ stages, services, onAddClient, showBackButton, onBack }) => {
  const [chats, setChats] = React.useState<WhatsappChat[]>([]);
  const [messages, setMessages] = React.useState<WhatsappMessage[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<WhatsappChat | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isKanbanModalOpen, setKanbanModalOpen] = React.useState(false);

  React.useEffect(() => {
    // In a real app, you would fetch this data from Supabase/your backend
    setLoading(true);
    setTimeout(() => {
      setChats(mockChats);
      if (mockChats.length > 0) {
        setSelectedChat(mockChats[0]);
        setMessages(mockMessages[mockChats[0].jid] || []);
      }
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleSelectChat = (chat: WhatsappChat) => {
      setSelectedChat(chat);
      setMessages(mockMessages[chat.jid] || []);
  };

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Chat List */}
      <aside className="w-full md:w-1/3 lg:w-1/4 border-r dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b dark:border-slate-700 flex-shrink-0 flex items-center gap-2">
            {showBackButton && (
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            )}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Conversas</h1>
          {/* Search input could go here */}
        </div>
        <div className="overflow-y-auto flex-grow">
          {chats.map(chat => (
            <button
              key={chat.jid}
              onClick={() => handleSelectChat(chat)}
              className={`w-full text-left p-4 flex items-center gap-4 border-b dark:border-slate-700 transition-colors ${
                selectedChat?.jid === chat.jid ? 'bg-pink-50 dark:bg-pink-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <img src={`https://ui-avatars.com/api/?name=${chat.name}&background=random`} alt={chat.name} className="w-12 h-12 rounded-full" />
              <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800 dark:text-slate-100 truncate">{chat.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">
                    {new Date(chat.last_message_timestamp || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{chat.lastMessage}</p>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                        <span className="bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Message View */}
      <main className="hidden md:flex flex-col flex-1">
        {selectedChat ? (
          <>
            <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${selectedChat.name}&background=random`} alt={selectedChat.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{selectedChat.jid}</p>
                </div>
              </div>
               <button onClick={() => setKanbanModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
                <ArrowUpRightSquare className="w-4 h-4" />
                Enviar para o Funil
              </button>
            </header>
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900">
                <div className="space-y-4">
                  {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-md p-3 rounded-2xl ${msg.is_from_me ? 'bg-pink-500 text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-lg'}`}>
                              <p>{msg.body}</p>
                              <p className={`text-xs mt-1 ${msg.is_from_me ? 'text-pink-100' : 'text-gray-400 dark:text-slate-500'} text-right`}>
                                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                          </div>
                      </div>
                  ))}
                </div>
            </div>
            <footer className="p-4 border-t dark:border-slate-700 flex items-center gap-4 bg-white dark:bg-slate-800 flex-shrink-0">
                <button className="p-2 text-gray-500 hover:text-pink-600"><Paperclip className="w-6 h-6"/></button>
                <input type="text" placeholder="Digite uma mensagem..." className="flex-grow bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                <button className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 shadow-md"><Send className="w-6 h-6"/></button>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-slate-400">
            <h2 className="text-2xl font-semibold">Selecione uma conversa</h2>
            <p>Escolha uma conversa da lista para ver as mensagens.</p>
          </div>
        )}
      </main>
      
      {isKanbanModalOpen && selectedChat && (
        <SendToKanbanModal
            isOpen={isKanbanModalOpen}
            onClose={() => setKanbanModalOpen(false)}
            onAddClient={onAddClient}
            stages={stages}
            services={services}
            initialData={{ name: selectedChat.name, phone: selectedChat.jid }}
        />
      )}
    </div>
  );
};

export default OmnichannelView;