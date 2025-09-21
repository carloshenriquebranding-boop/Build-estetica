
import * as React from 'react';
import { useDrop } from 'react-dnd';
import type { Appointment } from '../types.ts';
import AppointmentCard from './AppointmentCard.tsx';

interface CalendarDayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onOpenModal: (date: Date, appointment?: Appointment) => void;
  onUpdateAppointmentDate: (appointmentId: string, newDate: Date) => void;
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({ currentDate, appointments, onOpenModal, onUpdateAppointmentDate }) => {
    const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

    const dropRef = React.useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'APPOINTMENT_CARD',
        drop: (item: { id: string; date: string }) => {
            const originalDate = new Date(item.date);
            const newDate = new Date(currentDate);
            newDate.setHours(originalDate.getHours(), originalDate.getMinutes());
            onUpdateAppointmentDate(item.id, newDate);
        },
        collect: monitor => ({ isOver: !!monitor.isOver() }),
    }));
    drop(dropRef);
    
    const dayAppointments = appointments
        .filter(a => new Date(a.date).toDateString() === currentDate.toDateString())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return (
        <div className="flex-grow flex flex-col overflow-auto">
            <div className="flex sticky top-0 bg-white dark:bg-slate-800 z-10">
                <div className="w-16 flex-shrink-0 border-b border-r dark:border-slate-700"></div> {/* Spacer */}
                <div className="flex-1 text-center py-2 border-b dark:border-slate-700">
                    {/* Header for the single day is now in the main CalendarView */}
                </div>
            </div>
            <div className="flex flex-grow overflow-y-auto">
                 <div className="w-16 flex-shrink-0">
                    {timeSlots.map(time => (
                        <div key={time} className="h-20 text-right pr-2 pt-1 text-xs text-gray-500 dark:text-slate-400 border-r dark:border-slate-700 -mt-px">
                            {time}
                        </div>
                    ))}
                </div>
                <div ref={dropRef} className={`flex-1 relative ${isOver ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}>
                     {timeSlots.map((time) => {
                        const [hour] = time.split(':').map(Number);
                        const slotDate = new Date(currentDate);
                        slotDate.setHours(hour, 0, 0, 0);
                        return (
                            <div
                                key={time}
                                onClick={() => onOpenModal(slotDate)}
                                className="h-20 border-t border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            ></div>
                        );
                    })}
                     <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                        {dayAppointments.map(appt => {
                            const top = (new Date(appt.date).getHours() - 7 + new Date(appt.date).getMinutes() / 60) * 80;
                            return (
                                <div key={appt.id} style={{ top: `${top}px`, height: '78px' }} className="absolute w-full px-1 pointer-events-auto">
                                   <AppointmentCard appointment={appt} onCardClick={() => onOpenModal(appt.date, appt)} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarDayView;
