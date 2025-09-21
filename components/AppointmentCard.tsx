

import * as React from 'react';
import { useDrag } from 'react-dnd';
import type { Appointment } from '../types.ts';
import { Bell } from './icons/index.ts';

interface AppointmentCardProps {
  appointment: Appointment;
  onCardClick: () => void;
  isCompact?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCardClick, isCompact = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'APPOINTMENT_CARD',
    item: { id: appointment.id, date: appointment.date.toISOString() },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const ref = React.useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onCardClick();
      }}
      className={`bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 rounded-md cursor-pointer hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'} ${isCompact ? 'p-1 text-[10px]' : 'text-xs p-1'}`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold truncate">{appointment.clientName}</p>
        {appointment.reminder_minutes_before && !appointment.reminder_sent && (
            // Fix: Wrapped the Bell icon in a span to apply the title attribute, resolving a TypeScript error where 'title' is not a valid prop for the SVG component.
            <span className="flex-shrink-0" title="Lembrete ativado">
                <Bell className="w-3 h-3" />
            </span>
        )}
      </div>
      {!isCompact && (
         <p>{new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
      )}
    </div>
  );
};

export default AppointmentCard;