import * as React from 'react';
import type { Client, Appointment, Transaction, Task, Service, Stage } from '../types.ts';
import {
  Users,
  CalendarDays,
  DollarSign,
  CheckSquare,
  Clock,
  UserPlus,
  CalendarPlus,
  ArrowLeft,
  Wand2,
  ArrowRight,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from './icons/index.ts';
import { getClientColor } from '../utils/colors.ts';

interface DashboardViewProps {
  clients: Client[];
  appointments: Appointment[];
  transactions: Transaction[];
  tasks: Task[];
  services: Service[];
  stages: Stage[];
  showBackButton?: boolean;
  onBack?: () => void;
  setActiveView: (view: string) => void;
}

const StatCard: React.FC<{
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  description: string;
  gradientClass: string;
}> = ({ icon, title, value, description, gradientClass }) => (
    <div className={`relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border dark:border-slate-800`}>
        <div className={`absolute -top-4 -right-4 text-white/10 dark:text-white/5`}>
            {React.cloneElement(icon, { className: "w-28 h-28" })}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5"></div>
        <div className="relative z-10">
             <div className={`p-3 w-fit rounded-xl mb-4 text-white ${gradientClass}`}>
                {React.cloneElement(icon, { className: "w-7 h-7" })}
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{description}</p>
        </div>
    </div>
);


const ActivityIcon: React.FC<{type: string}> = ({ type }) => {
    const iconMap: Record<string, { icon: React.ReactNode, color: string }> = {
        'new_client': { icon: <UserPlus className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
        'new_appointment': { icon: <CalendarPlus className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400' },
        'task_completed': { icon: <CheckSquare className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' },
        'new_transaction': { icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
    };
    const { icon, color } = iconMap[type] || { icon: <ArrowRight className="w-5 h-5"/>, color: 'bg-gray-100 text-gray-600' };

    return <div className={`p-2 rounded-full ${color}`}>{icon}</div>;
};

// --- AI Agent Components ---
const AgentAvatar: React.FC<{ name: string, color: string }> = ({ name, color }) => (
    <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${color}`}>
        {name.charAt(0)}
    </div>
);

const Suggestion: React.FC<{ children: React.ReactNode, actionText?: string, onAction?: () => void }> = ({ children, actionText, onAction }) => (
    <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-slate-700/50 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
        <div className="flex-grow">
            <div className="text-sm text-slate-700 dark:text-slate-300">{children}</div>
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg flex flex-col border dark:border-slate-800">
        <div className="flex items-center gap-4 mb-4">
            <AgentAvatar name={name} color={avatarColor} />
            <div>
                <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">{name}</h3>
                <p className="text-sm font-medium text-pink-500 dark:text-pink-400">{title}</p>
            </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">{summary}</p>
        <div className="space-y-3 flex-grow flex flex-col justify-end">
            {children}
        </div>
    </div>
);

const AIAgentsSection: React.FC<{
    clients: Client[];
    transactions: Transaction[];
    tasks: Task[];
    appointments: Appointment[];
    services: Service[];
    setActiveView: (view: string) => void;
}> = ({ clients, transactions, tasks, appointments, services, setActiveView }) => {
    const revenueThisMonth = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const pendingTasks = tasks.filter(t => !t.completed);

    // --- Dynamic Suggestions Logic ---

    // 1. Carlos (Financial) - Find most popular service
    const serviceCounts = appointments.reduce((acc, appt) => {
        acc[appt.treatment] = (acc[appt.treatment] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const [topService] = Object.entries(serviceCounts).sort(([, a], [, b]) => b - a)[0] || ['Limpeza de Pele Profunda'];
    const carlosSuggestion1 = `O serviço de <strong>${topService}</strong> é o mais procurado. Sugiro criar um pacote promocional com 3 sessões para aumentar o ticket médio.`;

    // Find a high-value client who hasn't returned
    const highValueClient = clients.find(c => c.id === 'client-5'); // Example
    const carlosSuggestion2 = highValueClient
        ? `Cliente <strong>${highValueClient.name}</strong> realizou um procedimento de alto valor e não retornou. Uma oferta de "Indique um Amigo" pode reativá-la e trazer novos leads.`
        : `Analise seus clientes de maior valor e considere criar um programa de fidelidade para incentivá-los a retornar.`;

    // 2. Sofia (Scheduling) - Find a day with free slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentCountsByDay: Record<string, number> = {};
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        appointmentCountsByDay[date.toISOString().split('T')[0]] = 0;
    }
    appointments.forEach(appt => {
        const dateString = new Date(appt.date).toISOString().split('T')[0];
        if (appointmentCountsByDay[dateString] !== undefined) {
            appointmentCountsByDay[dateString]++;
        }
    });
    const quietestDayString = Object.entries(appointmentCountsByDay).sort(([,a], [,b]) => a - b)[0]?.[0] || '';
    const quietestDay = new Date(quietestDayString);
    quietestDay.setTime(quietestDay.getTime() + quietestDay.getTimezoneOffset() * 60 * 1000);
    const quietestDayName = quietestDay.toLocaleDateString('pt-BR', { weekday: 'long' });
    const sofiaSuggestion1 = `A próxima <strong>${quietestDayName}</strong> parece ter horários livres. Que tal criar uma oferta "Flash" para preenchê-la?`;

    // Find a client stuck in the funnel
    const clientStuckInFunnel = clients.find(c => c.stage_id === 'stage-2');
    const sofiaSuggestion2 = clientStuckInFunnel
        ? `O cliente <strong>${clientStuckInFunnel.name}</strong> está no estágio "Contato Feito" há algum tempo. Uma mensagem proativa para agendar a avaliação pode convertê-lo.`
        : `Todos os seus leads estão avançando bem no funil! Continue o ótimo trabalho de follow-up.`;

    // 3. Rita (Operational) - Find most urgent pending task
    const mostUrgentTask = [...pendingTasks].sort((a, b) => {
        if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        if (a.due_date) return -1;
        if (b.due_date) return 1;
        return 0;
    })[0];
    const ritaSuggestion1 = mostUrgentTask
        ? `A tarefa "<strong>${mostUrgentTask.title}</strong>" está pendente. Priorize-a para manter a operação em dia.`
        : `Você não tem tarefas urgentes pendentes. Que tal planejar as compras para o próximo mês?`;

    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
               <Wand2 className="w-8 h-8 text-pink-500"/>
               <h2 className="text-3xl font-bold font-display tracking-tight text-slate-700 dark:text-slate-200">Central de Inteligência</h2>
            </div>
            <p className="mb-8 text-slate-600 dark:text-slate-400 max-w-3xl">
                Nossos agentes de IA analisaram seus dados e prepararam sugestões para otimizar sua clínica.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AgentCard 
                    name="Carlos" 
                    title="Consultor Financeiro" 
                    avatarColor="bg-gradient-to-br from-green-500 to-emerald-500"
                    summary={`Com uma receita de ${revenueThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} este mês, identifiquei oportunidades para aumentar seu faturamento.`}
                >
                    <Suggestion actionText="Ver Serviços" onAction={() => setActiveView('services')}>
                        <span dangerouslySetInnerHTML={{ __html: carlosSuggestion1 }} />
                    </Suggestion>
                     <Suggestion actionText="Ver Clientes" onAction={() => setActiveView('clients')}>
                        <span dangerouslySetInnerHTML={{ __html: carlosSuggestion2 }} />
                    </Suggestion>
                </AgentCard>

                 <AgentCard 
                    name="Sofia" 
                    title="Assistente de Agendamento" 
                    avatarColor="bg-gradient-to-br from-pink-500 to-rose-500"
                    summary="Analisei sua agenda para os próximos dias e notei alguns horários vagos que podemos preencher para maximizar sua ocupação."
                >
                    <Suggestion actionText="Ver Agenda" onAction={() => setActiveView('calendar')}>
                        <span dangerouslySetInnerHTML={{ __html: sofiaSuggestion1 }} />
                    </Suggestion>
                     <Suggestion actionText="Ver Clientes" onAction={() => setActiveView('clients')}>
                        <span dangerouslySetInnerHTML={{ __html: sofiaSuggestion2 }} />
                    </Suggestion>
                </AgentCard>

                 <AgentCard 
                    name="Rita" 
                    title="Gestora Operacional" 
                    avatarColor="bg-gradient-to-br from-blue-500 to-indigo-500"
                    summary={`Gerenciando suas tarefas e estoque, notei ${pendingTasks.length} tarefas pendentes. Manter a operação em dia é crucial.`}
                >
                    <Suggestion actionText="Ver Tarefas" onAction={() => setActiveView('tasks')}>
                        <span dangerouslySetInnerHTML={{ __html: ritaSuggestion1 }} />
                    </Suggestion>
                    <Suggestion actionText="Criar Tarefa" onAction={() => setActiveView('tasks')}>
                        Para evitar rupturas de estoque, sugiro criar uma tarefa recorrente mensal para "Verificação de Inventário".
                    </Suggestion>
                </AgentCard>
            </div>
        </div>
    );
};

const ClinicOverviewInfographic: React.FC<{
  clients: Client[];
  stages: Stage[];
  appointments: Appointment[];
  transactions: Transaction[];
}> = ({ clients, stages, appointments, transactions }) => {

  const funnelData = React.useMemo(() => {
    const counts = clients.reduce((acc, client) => {
      acc[client.stage_id] = (acc[client.stage_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stages.map(stage => ({
      ...stage,
      count: counts[stage.id] || 0,
    }));
  }, [clients, stages]);

  const topServices = React.useMemo(() => {
    const counts = appointments.reduce((acc, appt) => {
      acc[appt.treatment] = (acc[appt.treatment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [appointments]);
  const maxServiceCount = topServices.length > 0 ? topServices[0][1] : 0;
  
  const weeklyRevenue = React.useMemo(() => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const days = Array.from({length: 7}).map((_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          return { date: d.toISOString().split('T')[0], day: d.toLocaleDateString('pt-BR', { weekday: 'short' })[0].toUpperCase(), revenue: 0 };
      }).reverse();
      
      transactions.forEach(t => {
          if (t.type === 'income') {
              const transactionDate = new Date(t.date).toISOString().split('T')[0];
              const dayData = days.find(d => d.date === transactionDate);
              if (dayData) dayData.revenue += t.amount;
          }
      });
      return days;
  }, [transactions]);
  const maxWeeklyRevenue = Math.max(...weeklyRevenue.map(d => d.revenue), 1); // Avoid division by zero

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border dark:border-slate-800">
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100 mb-6">Visão Geral da Clínica</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Funnel */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                    <Filter className="w-5 h-5 text-pink-500" />
                    <h3>Funil de Vendas</h3>
                </div>
                <div className="space-y-2">
                  {funnelData.map((stage, index) => {
                    const color = getClientColor(stage.id); // Using the same hash logic for consistent stage colors
                    const widthPercentage = funnelData[0].count > 0 ? (stage.count / funnelData[0].count) * 100 : 0;
                    return (
                        <div key={stage.id} className="flex items-center gap-3 text-sm">
                            <span className="w-24 sm:w-28 truncate text-right text-slate-500 dark:text-slate-400 flex-shrink-0">{stage.title}</span>
                            <div className={`flex-grow h-8 rounded ${color.bg100} dark:bg-opacity-40 flex items-center justify-between px-3`} style={{ width: `${widthPercentage}%`, minWidth: '40px' }}>
                                <span className={`font-bold ${color.text800} dark:text-slate-200`}>{stage.count}</span>
                            </div>
                        </div>
                    )
                  })}
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Top Services */}
              <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                      <BarChart3 className="w-5 h-5 text-pink-500" />
                      <h3>Serviços Populares</h3>
                  </div>
                   <div className="space-y-3 text-xs sm:text-sm">
                        {topServices.map(([name, count]) => (
                            <div key={name}>
                                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                                    <span className="truncate pr-2">{name}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full bg-stone-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full" style={{ width: `${(count / maxServiceCount) * 100}%`}}></div>
                                </div>
                            </div>
                        ))}
                   </div>
              </div>

              {/* Revenue Trend */}
              <div className="space-y-3 overflow-hidden">
                  <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                      <TrendingUp className="w-5 h-5 text-pink-500" />
                      <h3>Faturamento (7d)</h3>
                  </div>
                  <div className="flex justify-between items-end h-32 gap-1 sm:gap-2 border-b-2 border-stone-200 dark:border-slate-700 pb-2">
                    {weeklyRevenue.map(day => (
                        <div key={day.date} className="w-full flex flex-col items-center justify-end h-full gap-1 group">
                           <div className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                               {day.revenue.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}
                           </div>
                           <div 
                               className="w-full bg-gradient-to-t from-pink-300 to-rose-300 dark:from-pink-800 dark:to-rose-800 rounded-t-sm hover:from-pink-500 hover:to-rose-500 transition-all"
                               style={{ height: `${(day.revenue / maxWeeklyRevenue) * 90}%`}}
                            ></div>
                           <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{day.day}</span>
                        </div>
                    ))}
                  </div>
              </div>
            </div>
        </div>
    </div>
  );
}


const DashboardView: React.FC<DashboardViewProps> = ({ clients, appointments, transactions, tasks, services, stages, showBackButton, onBack, setActiveView }) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const newClientsThisMonth = clients.length; // Assuming mock data represents a single month
    
    const revenueThisMonth = transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    const appointmentsToday = appointments
        .filter(a => new Date(a.date).toDateString() === today.toDateString())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pendingTasks = tasks.filter(t => !t.completed);
    
    const activityFeed = React.useMemo(() => {
        const combined = [
            ...clients.map((item, i) => ({
                id: `c-${item.id}`,
                type: 'new_client' as const,
                timestamp: new Date(Date.now() - i * 3600000 * 6), // Faked timestamp
                text: <>Novo cliente <strong>{item.name}</strong> foi adicionado.</>
            })),
            ...appointments.map(item => ({
                id: `a-${item.id}`,
                type: 'new_appointment' as const,
                timestamp: new Date(item.date),
                text: <>Agendamento para <strong>{item.clientName}</strong> em {new Date(item.date).toLocaleDateString('pt-BR')}.</>
            })),
            ...tasks.filter(t => t.completed).map((item, i) => ({
                id: `t-${item.id}`,
                type: 'task_completed' as const,
                timestamp: new Date(Date.now() - i * 3600000 * 4), // Faked timestamp
                text: <>Tarefa <strong>{item.title}</strong> foi concluída.</>
            })),
            ...transactions.filter(t => t.type === 'income').map(item => ({
                id: `tr-${item.id}`,
                type: 'new_transaction' as const,
                timestamp: new Date(item.date),
                text: <>Nova receita de <strong>{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> registrada.</>
            }))
        ];
        return combined.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 7);
    }, [clients, appointments, tasks, transactions]);

    const getTaskStatusInfo = (task: Task) => {
        if (task.completed || !task.due_date) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { 
                days: diffDays,
                text: `Vencida há ${Math.abs(diffDays)} dia(s)`, 
                color: 'text-red-600 dark:text-red-400',
                icon: <AlertTriangle className="w-5 h-5"/>,
                iconBgColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
            };
        }
        if (diffDays === 0) {
            return { 
                days: diffDays,
                text: 'Vence hoje', 
                color: 'text-orange-600 dark:text-orange-400',
                icon: <Clock className="w-5 h-5"/>,
                iconBgColor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
            };
        }
        return { 
            days: diffDays,
            text: diffDays === 1 ? 'Vence amanhã' : `Vence em ${diffDays} dias`, 
            color: 'text-blue-600 dark:text-blue-400',
            icon: <Clock className="w-5 h-5"/>,
            iconBgColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
        };
    };

    const tasksWithReminders = tasks
        .map(t => ({ ...t, statusInfo: getTaskStatusInfo(t) }))
        .filter(t => t.statusInfo && t.statusInfo.days <= 7)
        .sort((a, b) => (a.statusInfo?.days ?? 99) - (b.statusInfo?.days ?? 99))
        .slice(0, 5);
        
    const clientMap = React.useMemo(() => new Map(clients.map(c => [c.id, c.name])), [clients]);


    const AppointmentsBlock = (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border dark:border-slate-800">
            <h2 className="text-xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100 mb-4">Agendamentos de Hoje</h2>
            <div className="space-y-4">
                {appointmentsToday.length > 0 ? appointmentsToday.map(appt => (
                    <div key={appt.id} className="flex items-center gap-4 p-3 bg-stone-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-semibold text-pink-600 dark:text-pink-400 w-24">
                            <Clock className="w-4 h-4"/>
                            <span>{new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="border-l-2 border-pink-200 dark:border-pink-800 pl-4 flex-grow">
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{appt.clientName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{appt.treatment}</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">Nenhum agendamento para hoje.</p>
                )}
            </div>
        </div>
    );
    
    const RemindersBlock = (
         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border dark:border-slate-800">
            <h2 className="text-xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100 mb-4">Lembretes de Tarefas</h2>
            <div className="space-y-3">
               {tasksWithReminders.length > 0 ? tasksWithReminders.map(task => (
                 <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-800">
                    <div className={`p-2 rounded-full ${task.statusInfo?.iconBgColor}`}>
                        {task.statusInfo?.icon}
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{task.title}</p>
                        <div className="flex items-center gap-3 text-sm">
                           <p className={`font-semibold ${task.statusInfo?.color}`}>{task.statusInfo?.text}</p>
                           {task.client_id && <p className="text-slate-500 dark:text-slate-400">| {clientMap.get(task.client_id)}</p>}
                        </div>
                    </div>
                    <button onClick={() => setActiveView('tasks')} className="p-2 text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-full" aria-label="Ver tarefas">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
               )) : (
                   <p className="text-slate-500 dark:text-slate-400 text-center py-4">Nenhuma tarefa urgente. Bom trabalho!</p>
               )}
            </div>
        </div>
    );
    
    const StatsBlock = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                icon={<DollarSign />}
                title="Receita do Mês"
                value={revenueThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                description="Faturamento neste mês"
                gradientClass="bg-gradient-to-br from-green-500 to-emerald-500"
            />
             <StatCard 
                icon={<Users />}
                title="Total de Clientes"
                value={newClientsThisMonth}
                description="Clientes na sua base"
                gradientClass="bg-gradient-to-br from-blue-500 to-indigo-500"
            />
            <StatCard 
                icon={<CalendarDays />}
                title="Agendamentos Hoje"
                value={appointmentsToday.length}
                description="Compromissos para hoje"
                gradientClass="bg-gradient-to-br from-pink-500 to-rose-500"
            />
            <StatCard 
                icon={<CheckSquare />}
                title="Tarefas Pendentes"
                value={pendingTasks.length}
                description="Tarefas a serem concluídas"
                gradientClass="bg-gradient-to-br from-amber-500 to-orange-500"
            />
        </div>
    );
    
    const ActivityBlock = (
         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border dark:border-slate-800">
            <h2 className="text-xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100 mb-4">Atividade Recente</h2>
            <ul className="space-y-4">
               {activityFeed.map(item => (
                   <li key={item.id} className="flex items-start gap-3">
                       <ActivityIcon type={item.type} />
                       <div className="flex-grow">
                           <p className="text-sm text-slate-700 dark:text-slate-300">{item.text}</p>
                           <p className="text-xs text-slate-400 dark:text-slate-500">
                               {item.timestamp.toLocaleDateString('pt-BR')}
                           </p>
                       </div>
                   </li>
               ))}
            </ul>
        </div>
    );
    
    const InfographicBlock = <ClinicOverviewInfographic clients={clients} stages={stages} appointments={appointments} transactions={transactions} />;

    return (
        <div className="font-sans">
            <div className="flex items-center gap-2 mb-6">
                {showBackButton && (
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400" aria-label="Voltar">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                 <h1 className="text-3xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100">Dashboard</h1>
            </div>

            {/* Layout Unificado */}
            <div className="space-y-8">
                {StatsBlock}
                {InfographicBlock}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {AppointmentsBlock}
                        {RemindersBlock}
                    </div>

                    <div className="lg:col-span-1">
                        {ActivityBlock}
                    </div>
                </div>
                <AIAgentsSection clients={clients} transactions={transactions} tasks={tasks} appointments={appointments} services={services} setActiveView={setActiveView} />
            </div>
        </div>
    );
};

export default DashboardView;