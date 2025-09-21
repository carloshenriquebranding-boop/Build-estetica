import * as React from 'react';
import type { Client, Appointment, Transaction, Task, Service } from '../types.ts';
import { Wand2, Users, CalendarDays, DollarSign, CheckSquare, ArrowLeft, ArrowRight } from './icons/index.ts';

interface AIAgentsViewProps {
  clients: Client[];
  appointments: Appointment[];
  transactions: Transaction[];
  tasks: Task[];
  services: Service[];
  showBackButton?: boolean;
  onBack?: () => void;
  setActiveView: (view: string) => void;
}

const AgentAvatar: React.FC<{ name: string, color: string }> = ({ name, color }) => (
    <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${color}`}>
        {name.charAt(0)}
    </div>
);

const Suggestion: React.FC<{ children: React.ReactNode, actionText?: string, onAction?: () => void }> = ({ children, actionText, onAction }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
        <div className="flex-grow">
            <p className="text-sm text-slate-700 dark:text-slate-300">{children}</p>
            {actionText && onAction && (
                <button onClick={onAction} className="mt-2 flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300">
                    {actionText} <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    </div>
);

const AgentCard: React.FC<{
    name: string;
    title: string;
    avatarColor: string;
    summary: string;
    children: React.ReactNode;
}> = ({ name, title, avatarColor, summary, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <AgentAvatar name={name} color={avatarColor} />
            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{name}</h3>
                <p className="text-sm font-medium text-pink-500 dark:text-pink-400">{title}</p>
            </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">{summary}</p>
        <div className="space-y-3 flex-grow flex flex-col justify-end">
            {children}
        </div>
    </div>
);

const AIAgentsView: React.FC<AIAgentsViewProps> = ({
  clients, appointments, transactions, tasks, services,
  showBackButton, onBack, setActiveView
}) => {

    const revenueThisMonth = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingTasks = tasks.filter(t => !t.completed);
    
    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                {showBackButton && (
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="flex items-center gap-3 text-3xl font-bold text-gray-700 dark:text-slate-200">
                   <Wand2 className="w-8 h-8 text-pink-500"/>
                   <span>Central de Inteligência</span>
                </div>
            </div>
            
            <p className="mb-8 text-slate-600 dark:text-slate-400 max-w-3xl">
                Nossos agentes de IA analisaram seus dados e prepararam sugestões para otimizar sua clínica.
                Veja abaixo as principais oportunidades identificadas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Agente Carlos - Financeiro */}
                <AgentCard 
                    name="Carlos" 
                    title="Consultor Financeiro" 
                    avatarColor="bg-green-500"
                    summary={`Com uma receita de ${revenueThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} este mês, identifiquei oportunidades para aumentar seu faturamento.`}
                >
                    <Suggestion actionText="Ver Serviços" onAction={() => setActiveView('services')}>
                        O serviço de <strong>Limpeza de Pele Profunda</strong> é o mais procurado. Sugiro criar um pacote promocional com 3 sessões para aumentar o ticket médio.
                    </Suggestion>
                     <Suggestion actionText="Ver Clientes" onAction={() => setActiveView('clients')}>
                        Cliente <strong>Fernanda Lima</strong> realizou um procedimento de alto valor e não retornou. Uma oferta de "Indique um Amigo" pode reativá-la e trazer novos leads.
                    </Suggestion>
                </AgentCard>

                {/* Agente Sofia - Agenda */}
                 <AgentCard 
                    name="Sofia" 
                    title="Assistente de Agendamento" 
                    avatarColor="bg-pink-500"
                    summary="Analisei sua agenda para os próximos dias e notei alguns horários vagos que podemos preencher para maximizar sua ocupação."
                >
                    <Suggestion actionText="Ver Agenda" onAction={() => setActiveView('calendar')}>
                        Você possui <strong>3 horários livres</strong> na próxima quinta-feira. Que tal criar uma oferta "Flash" para preenchê-los, divulgando nos stories do Instagram?
                    </Suggestion>
                     <Suggestion actionText="Ver Clientes" onAction={() => setActiveView('clients')}>
                        O cliente <strong>Carlos Eduardo</strong> está no estágio "Contato Feito" há algum tempo. Uma mensagem proativa para agendar a avaliação pode convertê-lo.
                    </Suggestion>
                </AgentCard>

                {/* Agente Rita - Operacional */}
                 <AgentCard 
                    name="Rita" 
                    title="Gestora Operacional" 
                    avatarColor="bg-blue-500"
                    summary={`Gerenciando suas tarefas e estoque, notei ${pendingTasks.length} tarefas pendentes. Manter a operação em dia é crucial.`}
                >
                    <Suggestion actionText="Ver Tarefas" onAction={() => setActiveView('tasks')}>
                        A tarefa "Comprar novos produtos de peeling" está pendente. A falta deste item pode impactar agendamentos futuros.
                    </Suggestion>
                    <Suggestion actionText="Criar Tarefa" onAction={() => setActiveView('tasks')}>
                        Para evitar rupturas de estoque, sugiro criar uma tarefa recorrente mensal para "Verificação de Inventário".
                    </Suggestion>
                </AgentCard>

            </div>

        </div>
    );
};

export default AIAgentsView;