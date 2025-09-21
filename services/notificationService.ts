// services/notificationService.ts

import type { Appointment } from '../types.ts';

/**
 * Este serviço atuará como um orquestrador para o envio de notificações.
 * Ele será chamado pelos agentes de IA ou por gatilhos do sistema.
 * A lógica de envio real (especialmente para o WhatsApp com Baileys)
 * deve residir no backend por razões de segurança e estabilidade.
 * O frontend apenas invocará as APIs expostas pelo backend.
 */

interface NotificationPayload {
  channel: 'whatsapp' | 'email';
  recipient: string; // Número de telefone ou endereço de e-mail
  templateId: string; // ID do template de mensagem (ex: 'lembrete_24h')
  variables: Record<string, any>; // Variáveis para popular o template (ex: { clientName: 'Ana', time: '14:00' })
}

export const sendNotification = async (payload: NotificationPayload) => {
  // TODO: Fazer uma chamada para a API do nosso backend, que por sua vez
  // irá processar e enviar a notificação usando o serviço apropriado (Baileys, SendGrid, etc.).
  console.log(`Enviando notificação via ${payload.channel} para ${payload.recipient}`, payload);
  // Simula uma chamada de API
  return new Promise(resolve => setTimeout(() => resolve({ status: 'sent' }), 500));
};

/**
 * Simula o agendamento de uma notificação de lembrete no backend.
 * @param appointment O agendamento para o qual o lembrete será enviado.
 */
export const scheduleReminder = async (appointment: Appointment) => {
  if (!appointment.reminder_minutes_before) {
    console.log(`[Notification Service] No reminder to schedule for appointment ${appointment.id}`);
    return;
  }
  
  const reminderTime = new Date(new Date(appointment.date).getTime() - appointment.reminder_minutes_before * 60000);

  // Simula uma chamada de API para um endpoint de agendamento de notificação.
  console.log(`[Notification Service] Scheduling reminder for appointment ${appointment.id} (${appointment.clientName}) to be sent at ${reminderTime.toLocaleString('pt-BR')}.`);
  
  return new Promise(resolve => setTimeout(() => resolve({ status: 'scheduled' }), 300));
};
