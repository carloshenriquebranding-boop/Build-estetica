import * as React from 'react';
import type { Client, Appointment, Task, Note } from '../types.ts';
import { X, Search, UserCircle, CalendarDays, CheckSquare, FileText } from './icons/index.ts';

type ClientResult = { type: 'client', data: Client };
type AppointmentResult = { type: 'appointment', data: Appointment };
type TaskResult = { type: 'task', data: Task };
type NoteResult = { type: 'note', data: Note };
type SearchResult = ClientResult | AppointmentResult | TaskResult | NoteResult;

interface SearchViewProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  appointments: Appointment[];
  tasks: Task[];
  notes: Note[];
  onNavigate: (view: string, searchTerm?: string) => void;
  onEditClient: (client: Client) => void;
  onEditAppointment: (appointment: Appointment) => void;
}

const ResultItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <li>
        <button onClick={onClick} className="w-full text-left p-3 flex items-center gap-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
            <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-500 dark:text-slate-400">
                {icon}
            </div>
            <div className="overflow-hidden">
                <p className="font-semibold text-gray-800 dark:text-slate-100 truncate">{title}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{description}</p>
            </div>
        </button>
    </li>
);

const SearchView: React.FC<SearchViewProps> = ({
    isOpen, onClose, clients, appointments, tasks, notes,
    onNavigate, onEditClient, onEditAppointment
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            // Focus input when modal opens
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            // Reset state when closed
            setSearchTerm('');
            setResults([]);
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            return;
        }

        const lowerCaseTerm = searchTerm.toLowerCase();
        const allResults: SearchResult[] = [];

        clients.forEach(c => {
            if (c.name.toLowerCase().includes(lowerCaseTerm) || c.phone.includes(lowerCaseTerm) || c.email?.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({ type: 'client', data: c });
            }
        });

        appointments.forEach(a => {
            if (a.clientName.toLowerCase().includes(lowerCaseTerm) || a.treatment.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({ type: 'appointment', data: a });
            }
        });

        tasks.forEach(t => {
            if (t.title.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({ type: 'task', data: t });
            }
        });
        
        notes.forEach(n => {
            if (n.title.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({ type: 'note', data: n });
            }
        });
        
        setResults(allResults);

    }, [searchTerm, clients, appointments, tasks, notes]);

    const handleResultClick = (result: SearchResult) => {
        switch(result.type) {
            case 'client': onEditClient(result.data); break;
            case 'appointment': onEditAppointment(result.data); break;
            case 'task': onNavigate('tasks'); break;
            case 'note': onNavigate('notes', result.data.title); break;
        }
    };
    
    const groupedResults = results.reduce((acc, result) => {
        const key = result.type;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(result);
        return acc;
    }, {} as Record<SearchResult['type'], SearchResult[]>);

    const groupConfig: Record<SearchResult['type'], { title: string; icon: React.ReactNode }> = {
        client: { title: 'Clientes', icon: <UserCircle className="w-5 h-5" /> },
        appointment: { title: 'Agendamentos', icon: <CalendarDays className="w-5 h-5" /> },
        task: { title: 'Tarefas', icon: <CheckSquare className="w-5 h-5" /> },
        note: { title: 'Notas', icon: <FileText className="w-5 h-5" /> },
    };
    
    const renderResultData = (result: SearchResult) => {
        switch(result.type) {
            case 'client': return { title: result.data.name, description: result.data.phone };
            case 'appointment': return { title: result.data.clientName, description: `${result.data.treatment} em ${new Date(result.data.date).toLocaleDateString()}`};
            case 'task': return { title: result.data.title, description: result.data.due_date ? `Vence em ${new Date(result.data.due_date).toLocaleDateString()}` : 'Sem data' };
            case 'note': return { title: result.data.title, description: `Modificado em ${new Date(result.data.updated_at).toLocaleDateString()}`};
        }
    };


    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-16 sm:pt-24 p-4" 
            onClick={onClose}
            role="dialog" 
            aria-modal="true"
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 flex flex-col max-h-[70vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <header className="p-4 border-b dark:border-slate-700 flex items-center gap-2 flex-shrink-0">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por clientes, tarefas, notas..."
                            className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <button onClick={onClose} className="text-sm font-semibold text-pink-600 dark:text-pink-400 px-2 py-1 md:hidden">
                        Cancelar
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto p-4">
                    {searchTerm.length < 2 && (
                        <div className="text-center pt-10 text-gray-500 dark:text-slate-400">
                            <Search className="w-16 h-16 mx-auto opacity-20" />
                            <p className="mt-4 font-semibold">Busca Rápida</p>
                            <p className="text-sm">Encontre qualquer coisa no seu CRM.</p>
                        </div>
                    )}
                    {searchTerm.length >= 2 && results.length === 0 && (
                         <div className="text-center pt-10 text-gray-500 dark:text-slate-400">
                            <p className="font-semibold">Nenhum resultado encontrado</p>
                            <p className="text-sm">Tente usar termos de busca diferentes.</p>
                        </div>
                    )}
                    {results.length > 0 && (
                        <div className="space-y-6">
                            {Object.entries(groupedResults).map(([key, resItems]) => (
                                <div key={key}>
                                    <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-slate-400 px-3 mb-2">
                                        {groupConfig[key as SearchResult['type']].title}
                                    </h3>
                                    <ul className="space-y-1">
                                        {resItems.map(result => {
                                            const { title, description } = renderResultData(result);
                                            return (
                                                <ResultItem
                                                    key={`${result.type}-${result.data.id}`}
                                                    icon={groupConfig[result.type].icon}
                                                    title={title}
                                                    description={description}
                                                    onClick={() => handleResultClick(result)}
                                                />
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchView;