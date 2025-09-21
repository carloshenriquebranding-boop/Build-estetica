import * as React from 'react';
import { useDrop } from 'react-dnd';
import type { Appointment } from '../types.ts';
import AppointmentCard from './AppointmentCard.tsx';

interface CalendarMonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onOpenModal: (date: Date, appointment?: Appointment) => void;
  onUpdateAppointmentDate: (appointmentId: string, newDate: Date) => void;
}

const MonthCalendarDay: React.FC<{
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
  onOpenModal: (date: Date, appointment?: Appointment) => void;
  onUpdateAppointmentDate: (appointmentId: string, newDate: Date) => void;
}> = ({ date, isCurrentMonth, isToday, appointments, onOpenModal, onUpdateAppointmentDate }) => {
  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'APPOINTMENT_CARD',
    drop: (item: { id: string; date: string }) => {
        const originalDate = new Date(item.date);
        const newDate = new Date(date);
        newDate.setHours(originalDate.getHours(), originalDate.getMinutes());
        onUpdateAppointmentDate(item.id, newDate);
    },
    collect: monitor => ({ isOver: !!monitor.isOver() }),
  }));
  drop(dropRef);

  const dayAppointments = appointments
    .filter(a => new Date(a.date).toDateString() === date.toDateString())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const handleDayClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.appointment-card-wrapper')) return;
    onOpenModal(date);
  };
  
  return (
    <div
      ref={dropRef}
      onClick={handleDayClick}
      className={`relative border-t border-r border-gray-200 dark:border-slate-700 p-2 flex flex-col gap-1 cursor-pointer transition-colors ${
        isCurrentMonth ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'
      } ${isOver ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}
    >
      <span className={`font-semibold ${isCurrentMonth ? 'text-gray-700 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'} ${isToday ? 'bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
        {date.getDate()}
      </span>
      <div className="flex-grow overflow-hidden">
        {/* Desktop view with cards */}
        <div className="hidden md:flex flex-col space-y-1 overflow-y-auto h-full">
          {dayAppointments.slice(0, 2).map(appt => (
            <div key={appt.id} className="appointment-card-wrapper">
              <AppointmentCard
                appointment={appt}
                onCardClick={() => onOpenModal(date, appt)}
                isCompact={true}
              />
            </div>
          ))}
          {dayAppointments.length > 2 && (
            <div className="text-xs text-pink-600 dark:text-pink-400 px-1 font-semibold">+ {dayAppointments.length - 2} mais</div>
          )}
        </div>
        {/* Mobile view with dots */}
        <div className="flex md:hidden items-center justify-start pt-1">
          {dayAppointments.length > 0 && (
            <div className="flex space-x-1">
              {dayAppointments.slice(0, 4).map(appt => (
                <div key={appt.id} className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
              ))}
              {dayAppointments.length > 4 && (
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({ currentDate, appointments, onOpenModal, onUpdateAppointmentDate }) => {
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const numberOfWeeks = days.length / 7;

  return (
    <>
      <div className="grid grid-cols-7">
        {weekDays.map(day => (
          <div key={day} className="text-center font-bold text-sm py-3 text-gray-600 dark:text-slate-400 border-b border-r border-gray-200 dark:border-slate-700 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-full" style={{ gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))` }}>
        {days.map(d => (
          <MonthCalendarDay
            key={d.toISOString()}
            date={d}
            isCurrentMonth={d.getMonth() === currentDate.getMonth()}
            isToday={d.toDateString() === new Date().toDateString()}
            appointments={appointments}
            onOpenModal={onOpenModal}
            onUpdateAppointmentDate={onUpdateAppointmentDate}
          />
        ))}
      </div>
    </>
  );
};

export default CalendarMonthView;