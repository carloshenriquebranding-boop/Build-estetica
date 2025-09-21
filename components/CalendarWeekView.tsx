import * as React from 'react';
import { useDrop } from 'react-dnd';
import type { Appointment } from '../types.ts';
import AppointmentCard from './AppointmentCard.tsx';

interface CalendarWeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onOpenModal: (date: Date, appointment?: Appointment) => void;
  onUpdateAppointmentDate: (appointmentId: string, newDate: Date) => void;
}

const DayColumn: React.FC<{
    day: Date;
    appointments: Appointment[];
    onOpenModal: (date: Date, appointment?: Appointment) => void;
    onUpdateAppointmentDate: (appointmentId: string, newDate: Date) => void;
    timeSlots: string[];
}> = ({ day, appointments, onOpenModal, onUpdateAppointmentDate, timeSlots }) => {
    const dropRef = React.useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'APPOINTMENT_CARD',
        drop: (item: { id: string; date: string }) => {
            const originalDate = new Date(item.date);
            const newDate = new Date(day);
            newDate.setHours(originalDate.getHours(), originalDate.getMinutes());
            onUpdateAppointmentDate(item.id, newDate);
        },
        collect: monitor => ({ isOver: !!monitor.isOver() }),
    }));
    drop(dropRef);

    const dayAppointments = appointments
        .filter(a => new Date(a.date).toDateString() === day.toDateString())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div ref={dropRef} className={`relative h-full ${isOver ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}>
            {timeSlots.map((time) => {
                const [hour] = time.split(':').map(Number);
                const slotDate = new Date(day);
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
                    const top = (new Date(appt.date).getHours() - 7 + new Date(appt.date).getMinutes() / 60) * 80; // 80px = h-20
                    return (
                        <div key={appt.id} style={{ top: `${top}px`, height: '78px' }} className="absolute w-full px-1 pointer-events-auto">
                           <AppointmentCard appointment={appt} onCardClick={() => onOpenModal(appt.date, appt)} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ currentDate, appointments, onOpenModal, onUpdateAppointmentDate }) => {
    const daysOfWeek: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        daysOfWeek.push(day);
    }
    
    const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

    return (
        <div className="flex-grow flex flex-col overflow-auto">
            {/* Desktop View: Grid */}
            <div className="hidden md:flex flex-grow flex-col">
                <div className="flex sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div className="w-16 flex-shrink-0 border-r border-b dark:border-slate-700"></div>
                    {daysOfWeek.map(day => (
                        <div key={day.toISOString()} className="flex-1 text-center py-2 border-b border-r dark:border-slate-700 last:border-r-0">
                            <p className="text-sm text-gray-500 dark:text-slate-400">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                            <p className={`text-xl md:text-2xl font-bold ${day.toDateString() === new Date().toDateString() ? 'text-pink-600' : 'text-gray-800 dark:text-slate-200'}`}>{day.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-grow overflow-y-auto">
                    <div className="w-16 flex-shrink-0">
                        {timeSlots.map(time => (
                            <div key={time} className="h-20 text-right pr-2 pt-1 text-xs text-gray-500 dark:text-slate-400 border-r dark:border-slate-700 -mt-px">
                                {time}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 grid grid-cols-7">
                        {daysOfWeek.map(day => (
                            <div key={day.toISOString()} className="border-r dark:border-slate-700 last:border-r-0">
                                <DayColumn 
                                    day={day}
                                    appointments={appointments}
                                    onOpenModal={onOpenModal}
                                    onUpdateAppointmentDate={onUpdateAppointmentDate}
                                    timeSlots={timeSlots}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Mobile View: List */}
            <div className="md:hidden flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                {daysOfWeek.map(day => {
                    const dayAppointments = appointments
                        .filter(a => new Date(a.date).toDateString() === day.toDateString())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                        <div key={day.toISOString()}>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`font-bold text-xl ${isToday ? 'text-pink-600' : 'text-gray-800 dark:text-slate-200'}`}>{day.getDate()}</span>
                                <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">{day.toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                            </div>
                            <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-slate-700">
                                {dayAppointments.length > 0 ? (
                                    dayAppointments.map(appt => (
                                        <div key={appt.id} onClick={() => onOpenModal(appt.date, appt)} className="p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm cursor-pointer border-l-4 border-pink-400">
                                            <p className="font-semibold text-gray-800 dark:text-slate-200">{appt.clientName}</p>
                                            <p className="text-sm text-gray-600 dark:text-slate-400">{appt.treatment}</p>
                                            <p className="text-sm font-bold text-pink-600 dark:text-pink-500 mt-1">
                                                {new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div onClick={() => onOpenModal(day)} className="p-3 text-sm text-gray-400 dark:text-slate-500 italic cursor-pointer">
                                        Nenhum agendamento
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CalendarWeekView;