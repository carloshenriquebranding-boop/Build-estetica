import * as React from 'react';
import type { Stage, Service, WhatsappChat, WhatsappMessage, Client } from '../types.ts';
import { Loader2, Send, Paperclip, ArrowUpRightSquare } from './icons/index.ts';
import SendToKanbanModal from './SendToKanbanModal.tsx';
import ViewHeader from './ViewHeader.tsx';
import * as db from '../services/databaseService.ts';
import { supabase } from '../services/supabaseClient.ts';

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
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [isKanbanModalOpen, setKanbanModalOpen] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const chatsData = await db.getWhatsappChats();
        setChats(chatsData);
        if (chatsData.length > 0) {
          handleSelectChat(chatsData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  React.useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Supabase Realtime subscription for new messages in the selected chat
  React.useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel(`whatsapp_messages:${selectedChat.id}`)
      .on<WhatsappMessage>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'whatsapp_messages', filter: `chat_id=eq.${selectedChat.id}` },
        (payload) => {
          setMessages(currentMessages => [...currentMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  const handleSelectChat = async (chat: WhatsappChat) => {
    setSelectedChat(chat);
    setLoadingMessages(true);
    try {
        const messagesData = await db.getWhatsappMessages(chat.id);
        setMessages(messagesData);
        if (chat.unread_count > 0) {
            await db.clearUnreadMessages(chat.id);
            // Optimistically update the UI
            setChats(prev => prev.map(c => c.id === chat.id ? {...c, unread_count: 0} : c));
        }
    } catch (error) {
        console.error("Failed to fetch messages for chat:", chat.id, error);
    } finally {
        setLoadingMessages(false);
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !selectedChat) return;
      
      const tempMessage = newMessage;
      setNewMessage('');
      
      try {
          await db.sendWhatsappMessage(selectedChat.id, tempMessage);
          // Simulate a reply after a short delay
          db.simulateIncomingMessage(selectedChat.id, tempMessage);
      } catch (error) {
          console.error("Failed to send message:", error);
          // Re-add message to input if sending fails
          setNewMessage(tempMessage);
      }
  };

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Chat List */}
      <aside className="w-full md:w-1/3 lg:w-1/4 border-r dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b dark:border-slate-700 flex-shrink-0">
            <ViewHeader title="Conversas" showBackButton={showBackButton} onBack={onBack}/>
        </div>
        <div className="overflow-y-auto flex-grow">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`w-full text-left p-4 flex items-center gap-4 border-b dark:border-slate-700 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-pink-50 dark:bg-pink-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <img src={`https://ui-avatars.com/api/?name=${chat.contact_name}&background=random`} alt={chat.contact_name} className="w-12 h-12 rounded-full" />
              <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800 dark:text-slate-100 truncate">{chat.contact_name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">
                    {new Date(chat.last_message_at || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{chat.last_message}</p>
                    {chat.unread_count > 0 && (
                        <span className="bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                            {chat.unread_count}
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
                <img src={`https://ui-avatars.com/api/?name=${selectedChat.contact_name}&background=random`} alt={selectedChat.contact_name} className="w-12 h-12 rounded-full" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{selectedChat.contact_name}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{selectedChat.contact_phone}</p>
                </div>
              </div>
               <button onClick={() => setKanbanModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
                <ArrowUpRightSquare className="w-4 h-4" />
                Enviar para o Funil
              </button>
            </header>
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900">
                {loadingMessages ? (
                    <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500"/></div>
                ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-md p-3 rounded-2xl ${msg.is_from_me ? 'bg-pink-500 text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-lg'}`}>
                                  <p>{msg.content}</p>
                                  <p className={`text-xs mt-1 ${msg.is_from_me ? 'text-pink-100' : 'text-gray-400 dark:text-slate-500'} text-right`}>
                                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                              </div>
                          </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <footer className="p-4 border-t dark:border-slate-700 flex items-center gap-4 bg-white dark:bg-slate-800 flex-shrink-0">
                <button className="p-2 text-gray-500 hover:text-pink-600"><Paperclip className="w-6 h-6"/></button>
                <form onSubmit={handleSendMessage} className="flex-grow flex items-center gap-4">
                  <input 
                    type="text" 
                    placeholder="Digite uma mensagem..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button type="submit" className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 shadow-md"><Send className="w-6 h-6"/></button>
                </form>
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
            initialData={{ name: selectedChat.contact_name, phone: selectedChat.contact_phone }}
        />
      )}
    </div>
  );
};

export default OmnichannelView;