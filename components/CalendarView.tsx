import * as React from 'react';
import type { Appointment } from '../types.ts';
import { ChevronLeft } from './icons/ChevronLeft.tsx';
import { ChevronRight } from './icons/ChevronRight.tsx';
import { Plus } from './icons/Plus.tsx';
import CalendarMonthView from './CalendarMonthView.tsx';
import CalendarWeekView from './CalendarWeekView.tsx';
import CalendarDayView from './CalendarDayView.tsx';
import { ArrowLeft } from './icons/index.ts';

type ViewType = 'month' | 'week' | 'day';

interface CalendarViewProps {
  appointments: Appointment[];
  onOpenModal: (date: Date, appointment?: Appointment) => void;
  onUpdateAppointmentDate: (appointmentId: string, newDate: Date) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ViewSwitcher: React.FC<{ currentView: ViewType; onViewChange: (view: ViewType) => void; }> = ({ currentView, onViewChange }) => {
    const views: { id: ViewType; label: string }[] = [
        { id: 'month', label: 'Mês' },
        { id: 'week', label: 'Semana' },
        { id: 'day', label: 'Dia' },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
            {views.map(view => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        currentView === view.id
                        ? 'bg-white dark:bg-slate-500 shadow text-pink-600 dark:text-pink-300'
                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                >
                    {view.label}
                </button>
            ))}
        </div>
    );
};

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onOpenModal, onUpdateAppointmentDate, showBackButton, onBack }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewType, setViewType] = React.useState<ViewType>('month');

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'day': newDate.setDate(newDate.getDate() - 1); break;
      case 'week': newDate.setDate(newDate.getDate() - 7); break;
      case 'month': newDate.setMonth(newDate.getMonth() - 1); break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'day': newDate.setDate(newDate.getDate() + 1); break;
      case 'week': newDate.setDate(newDate.getDate() + 7); break;
      case 'month': newDate.setMonth(newDate.getMonth() + 1); break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  }

  const getHeaderTitle = () => {
    switch(viewType) {
        case 'day':
            return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        case 'week':
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
                 return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${endOfWeek.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;
            }
            return `${startOfWeek.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})} - ${endOfWeek.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short', year: 'numeric'})}`;
        case 'month':
        default:
             return currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {showBackButton && (
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl md:text-3xl font-bold text-gray-700 dark:text-slate-200 capitalize">
                {getHeaderTitle()}
            </h1>
            <div className="flex items-center gap-1">
                <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400"><ChevronLeft className="w-5 h-5"/></button>
                <button onClick={handleToday} className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700">Hoje</button>
                <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400"><ChevronRight className="w-5 h-5"/></button>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <ViewSwitcher currentView={viewType} onViewChange={setViewType} />
            <button 
                onClick={() => onOpenModal(new Date())} 
                title="fazer novo agendamento"
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600"
            >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Novo</span>
            </button>
        </div>
      </header>
      
      <div className="flex-grow bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
        {viewType === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            appointments={appointments}
            onOpenModal={onOpenModal}
            onUpdateAppointmentDate={onUpdateAppointmentDate}
          />
        )}
        {viewType === 'week' && (
            <CalendarWeekView
                currentDate={currentDate}
                appointments={appointments}
                onOpenModal={onOpenModal}
                onUpdateAppointmentDate={onUpdateAppointmentDate}
            />
        )}
        {viewType === 'day' && (
             <CalendarDayView
                currentDate={currentDate}
                appointments={appointments}
                onOpenModal={onOpenModal}
                onUpdateAppointmentDate={onUpdateAppointmentDate}
            />
        )}
      </div>
    </div>
  );
};

export default CalendarView;