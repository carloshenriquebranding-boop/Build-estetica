import * as React from 'react';
import { Bot, Send, X, Loader2 } from './icons/index.ts';
import { startChatSession } from '../services/aiService.ts';
import type { Chat } from '@google/genai';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userInput, setUserInput] = React.useState('');
  const chatSessionRef = React.useRef<Chat | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Initialize chat session on component mount
    chatSessionRef.current = startChatSession();
  }, []);

  React.useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { sender: 'bot', text: 'Olá! Eu sou Gabi, sua assistente virtual do EstéticaCRM. Como posso te ajudar hoje?' }
      ]);
    }
  }, [isOpen]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading || !chatSessionRef.current) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: trimmedInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: trimmedInput });
      setMessages([...newMessages, { sender: 'bot', text: response.text }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages([...newMessages, { sender: 'bot', text: 'Desculpe, ocorreu um erro. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-24 right-4 sm:right-6 w-full max-w-sm rounded-xl shadow-2xl bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-full text-pink-600 dark:text-pink-400">
                <Bot className="w-6 h-6"/>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">Assistente Virtual</h2>
              <p className="text-xs text-green-500 font-semibold">Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </header>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-lg'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                 <div className="p-3 rounded-2xl bg-white dark:bg-slate-700 rounded-bl-lg">
                    <LoadingIndicator />
                 </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-slate-700 flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Digite sua dúvida..."
            className="flex-grow bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 shadow-md disabled:bg-pink-300">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
      
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-pink-700 transition-transform hover:scale-110 z-40"
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        {isOpen ? <X className="w-8 h-8"/> : <Bot className="w-8 h-8" />}
      </button>
    </>
  );
};

export default Chatbot;
