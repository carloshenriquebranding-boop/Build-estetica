import * as React from 'react';
import type { Appointment, Client, Service, Note } from '../types.ts';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { Trash } from './icons/Trash.tsx';
import { NotebookText } from './icons/NotebookText.tsx';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: Omit<Appointment, 'id' | 'clientName' | 'reminder_sent'> & { id?: string }) => Promise<void>;
  onDelete: (appointmentId: string) => Promise<void>;
  clients: Client[];
  services: Service[];
  notes: Note[];
  selectedDate: Date | null;
  appointment: Appointment | null;
  isSaving: boolean;
  isDeleting: boolean;
  onNavigateToNotes: (searchTerm: string) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen, onClose, onSave, onDelete, clients, services, notes,
  selectedDate, appointment, onNavigateToNotes
}) => {
  const [clientId, setClientId] = React.useState('');
  const [treatment, setTreatment] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [appointmentNotes, setAppointmentNotes] = React.useState('');
  const [reminderMinutes, setReminderMinutes] = React.useState<string>('none');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const initialDate = appointment?.date || selectedDate || new Date();
      setDate(initialDate.toISOString().split('T')[0]);
      setTime(initialDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setClientId(appointment?.client_id || (clients[0]?.id || ''));
      setTreatment(appointment?.treatment || (services[0]?.name || ''));
      setAppointmentNotes(appointment?.notes || '');
      setReminderMinutes(String(appointment?.reminder_minutes_before || 'none'));
    }
  }, [isOpen, appointment, selectedDate, clients, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setUTCHours(hours, minutes, 0, 0);

    await onSave({
      id: appointment?.id,
      client_id: clientId,
      treatment,
      date: combinedDate,
      notes: appointmentNotes,
      reminder_minutes_before: reminderMinutes === 'none' ? null : Number(reminderMinutes),
    });
    setIsSaving(false);
  };
  
  const handleDelete = async () => {
    if (!appointment) return;
    setIsDeleting(true);
    await onDelete(appointment.id);
    setIsDeleting(false);
  };
  
  const clientNotes = React.useMemo(() => {
    return notes.filter(n => n.client_id === clientId);
  }, [notes, clientId]);

  if (!isOpen) return null;
  
  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Cliente</label>
              <select
                id="client_id"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                required
                className={inputClasses}
              >
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Serviço</label>
              <select
                id="treatment"
                value={treatment}
                onChange={e => setTreatment(e.target.value)}
                required
                className={inputClasses}
              >
                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Data</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Horário</label>
                <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required className={inputClasses} />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Observações</label>
              <textarea
                id="notes"
                rows={3}
                value={appointmentNotes}
                onChange={e => setAppointmentNotes(e.target.value)}
                className={inputClasses}
              ></textarea>
            </div>
            <div>
              <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Lembrete</label>
              <select
                id="reminder"
                value={reminderMinutes}
                onChange={e => setReminderMinutes(e.target.value)}
                className={inputClasses}
              >
                <option value="none">Não lembrar</option>
                <option value="60">1 hora antes</option>
                <option value="120">2 horas antes</option>
                <option value="1440">24 horas antes</option>
                <option value="2880">2 dias antes</option>
              </select>
            </div>
            {clientNotes.length > 0 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                    <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2"><NotebookText className="w-4 h-4"/> Notas do Cliente</h4>
                    <ul className="space-y-1 text-xs list-disc list-inside">
                        {clientNotes.map(note => (
                            <li key={note.id} className="text-gray-700 dark:text-slate-300">
                                <button onClick={() => { onNavigateToNotes(note.title); onClose(); }} className="hover:underline">{note.title}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center rounded-b-xl">
            <div>
              {appointment && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 flex items-center justify-center w-32 disabled:bg-red-50"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Trash className="w-4 h-4 mr-2" /> Excluir</>}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">Cancelar</button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 flex items-center justify-center w-32 disabled:bg-pink-300">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;