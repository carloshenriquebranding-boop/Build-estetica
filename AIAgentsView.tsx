import * as React from 'react';
import type { AIAgent, KnowledgeSource } from '../types.ts';
import { Wand2, Plus, Pencil, MessageSquare, Bot, ArrowLeft, Cog, BookOpen, PlugZap, FileUp, Trash2, Send, Loader2 } from './icons/index.ts';
import ViewHeader from './ViewHeader.tsx';
import { INPUT_CLASSES } from '../constants.ts';

// --- Mock Data ---
const mockAgents: AIAgent[] = [
    {
        id: 'agent_1',
        user_id: 'user_123',
        name: 'Agente de Qualificação',
        description: 'Responsável por fazer o primeiro contato via WhatsApp e agendar avaliações.',
        status: 'active',
        llm_model: 'openai/gpt-4o',
        api_key: 'sk-xxxxxxxx',
        system_prompt: 'Você é um assistente de agendamento para uma clínica de estética. Seu objetivo é qualificar leads do WhatsApp, responder perguntas básicas sobre serviços com base no conhecimento fornecido e agendar uma avaliação. Seja sempre cordial e profissional.',
        knowledge_sources: [
            { id: 'ks_1', type: 'file', fileName: 'servicos_clinica.pdf', status: 'ready' },
        ],
        integrations: [
            { id: 'int_1', channel: 'whatsapp', channel_id: '+5511999998888', is_active: true },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'agent_2',
        user_id: 'user_123',
        name: 'Suporte Pós-Procedimento',
        description: 'Tira dúvidas comuns de clientes após realizarem procedimentos.',
        status: 'draft',
        llm_model: 'gemini-2.5-flash',
        api_key: null,
        system_prompt: 'Você é um assistente de pós-venda. Sua função é responder perguntas sobre cuidados pós-procedimento, utilizando estritamente o material de conhecimento fornecido. Não ofereça conselhos médicos.',
        knowledge_sources: [],
        integrations: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

// --- Sub-components ---

const AgentCard: React.FC<{ agent: AIAgent; onEdit: (agent: AIAgent) => void; }> = ({ agent, onEdit }) => {
    const statusStyles = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg border dark:border-slate-700 flex flex-col">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/50 rounded-lg text-pink-600 dark:text-pink-400">
                    <Bot className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">{agent.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{agent.description}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-slate-700 flex justify-between items-center text-sm">
                <span className={`px-2 py-0.5 font-semibold rounded-full ${statusStyles[agent.status]}`}>{agent.status}</span>
                <span className="text-gray-500 dark:text-slate-400">{agent.llm_model}</span>
            </div>
            <div className="mt-4 flex gap-2">
                <button onClick={() => onEdit(agent)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
                    <Pencil className="w-4 h-4" /> Editar
                </button>
                 <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
                    <MessageSquare className="w-4 h-4" /> Testar
                </button>
            </div>
        </div>
    );
};

const AgentEditor: React.FC<{ agent: AIAgent; onBack: () => void; onSave: (agent: AIAgent) => void; }> = ({ agent, onBack, onSave }) => {
    const [activeTab, setActiveTab] = React.useState('setup');
    
    const tabs = [
        { id: 'setup', label: 'Configuração', icon: <Cog className="w-5 h-5"/> },
        { id: 'prompt', label: 'Instruções', icon: <BookOpen className="w-5 h-5"/> },
        { id: 'knowledge', label: 'Conhecimento', icon: <FileUp className="w-5 h-5"/> },
        { id: 'integrations', label: 'Integrações', icon: <PlugZap className="w-5 h-5"/> },
    ];

    return (
        <div className="flex flex-col md:flex-row h-full gap-6">
            <aside className="w-full md:w-1/4">
                <nav className="space-y-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-left ${activeTab === tab.id ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                {activeTab === 'setup' && <SetupTab />}
                {activeTab === 'prompt' && <PromptTab />}
                {activeTab === 'knowledge' && <KnowledgeTab />}
                {activeTab === 'integrations' && <IntegrationsTab />}
            </main>
            <aside className="w-full md:w-1/3">
                <TestPlayground />
            </aside>
        </div>
    );
};

// --- Editor Tabs ---
const SetupTab: React.FC = () => (
    <div className="space-y-6">
        <div>
            <label className="font-medium">Nome do Agente</label>
            <input type="text" defaultValue="Agente de Qualificação" className={INPUT_CLASSES}/>
        </div>
         <div>
            <label className="font-medium">Modelo de LLM</label>
            <select className={INPUT_CLASSES} defaultValue="openai/gpt-4o">
                <option>gemini-2.5-flash</option>
                <option>openai/gpt-4o</option>
                <option>anthropic/claude-3.5-sonnet</option>
            </select>
        </div>
        <div>
            <label className="font-medium">Chave de API do Modelo</label>
            <input type="password" placeholder="Cole sua chave de API aqui" className={INPUT_CLASSES} />
            <p className="text-xs text-gray-500 mt-1">Sua chave será armazenada de forma segura.</p>
        </div>
    </div>
);
const PromptTab: React.FC = () => (
    <div>
        <label className="font-medium">Instruções do Agente (Prompt do Sistema)</label>
        <textarea rows={12} className={INPUT_CLASSES} defaultValue={'Você é um assistente de agendamento para uma clínica de estética...'} />
    </div>
);
const KnowledgeTab: React.FC = () => (
    <div>
        <h3 className="font-medium mb-2">Base de Conhecimento (RAG)</h3>
        <p className="text-sm text-gray-500 mb-4">Faça upload de arquivos (PDF, TXT) para que o agente possa responder perguntas sobre eles.</p>
        <div className="p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center cursor-pointer hover:border-pink-500">
            <FileUp className="w-8 h-8 mx-auto text-gray-400"/>
            <p className="mt-2 text-sm">Arraste arquivos ou clique para fazer upload</p>
        </div>
        <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                <span className="text-sm">servicos_clinica.pdf</span>
                <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
            </div>
        </div>
    </div>
);
const IntegrationsTab: React.FC = () => (
     <div>
        <h3 className="font-medium mb-4">Canais de Integração</h3>
        <div className="p-4 border rounded-lg dark:border-slate-600">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-green-500"><MessageSquare className="w-8 h-8"/></div>
                    <div>
                        <h4 className="font-semibold">WhatsApp</h4>
                        <p className="text-sm text-green-600">Conectado a +55 11 99999-8888</p>
                    </div>
                </div>
                <button className="text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-md">Desconectar</button>
            </div>
        </div>
    </div>
);
const TestPlayground: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col h-full">
            <h3 className="p-4 font-bold border-b dark:border-slate-700 flex-shrink-0">Playground de Teste</h3>
            <div className="flex-grow p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-slate-900/50">
                {/* Chat messages would go here */}
                 <div className="flex justify-start">
                    <div className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm">Olá! Como posso ajudar?</div>
                </div>
            </div>
            <div className="p-2 border-t dark:border-slate-700 flex-shrink-0">
                <div className="relative">
                    <input type="text" placeholder="Converse com seu agente..." className="w-full pr-10 bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2 text-sm"/>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-pink-600">
                        <Send className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    )
}


// --- Main View ---

const AIAgentsView: React.FC<{ showBackButton?: boolean; onBack?: () => void; }> = ({ showBackButton, onBack }) => {
    const [agents, setAgents] = React.useState<AIAgent[]>(mockAgents);
    const [editingAgent, setEditingAgent] = React.useState<AIAgent | null>(null);

    const handleCreateAgent = () => {
        const newAgent: AIAgent = {
            id: `agent_${Date.now()}`,
            user_id: 'user_123',
            name: 'Novo Agente',
            description: 'Descreva a função deste agente.',
            status: 'draft',
            llm_model: 'gemini-2.5-flash',
            api_key: null,
            system_prompt: 'Você é um assistente prestativo.',
            knowledge_sources: [],
            integrations: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setEditingAgent(newAgent);
    };

    const handleSaveAgent = (agentToSave: AIAgent) => {
        setAgents(prev => {
            const exists = prev.some(a => a.id === agentToSave.id);
            if (exists) {
                return prev.map(a => a.id === agentToSave.id ? agentToSave : a);
            }
            return [...prev, agentToSave];
        });
        setEditingAgent(null);
    };

    return (
        <div>
            {editingAgent ? (
                <>
                    <ViewHeader title={editingAgent.name} showBackButton={true} onBack={() => setEditingAgent(null)}>
                        <button onClick={() => handleSaveAgent(editingAgent)} className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg w-32">
                            Salvar
                        </button>
                    </ViewHeader>
                    <AgentEditor agent={editingAgent} onBack={() => setEditingAgent(null)} onSave={handleSaveAgent} />
                </>
            ) : (
                <>
                    <ViewHeader title="IA Agents" showBackButton={showBackButton} onBack={onBack}>
                        <button onClick={handleCreateAgent} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600">
                            <Plus className="w-5 h-5"/> Criar Agente
                        </button>
                    </ViewHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map(agent => (
                            <AgentCard key={agent.id} agent={agent} onEdit={setEditingAgent} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAgentsView;