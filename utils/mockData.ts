import type { Stage, Client, ClientTask, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate } from '../types.ts';
import { STAGE_COLORS } from './colors.ts';

// User Profile
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-123',
  name: 'Maria Esteticista',
  email: 'maria@esteticacrm.com',
  business_email: 'contato@esteticamaria.com',
  avatar_url: 'https://i.pravatar.cc/150?u=maria',
  business_name: 'Estética & Beleza Maria',
  business_phone: '(11) 98888-7777',
  business_address: 'Rua das Flores, 123, São Paulo, SP',
  role: 'admin',
  is_active: true,
  subscription_status: 'active',
  subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  budget_template: {
      primaryColor: '#db2777',
      secondaryColor: '#fdf2f8',
      textColor: '#1f2937',
      fontFamily: 'Poppins, sans-serif',
      logoUrl: null
  }
};

// Admin View Mock Users
export const MOCK_ADMIN_USERS: UserProfile[] = [
    MOCK_USER_PROFILE,
    { id: 'user-456', name: 'João Silva', email: 'joao@email.com', business_name: 'Clínica Silva', role: 'user', is_active: true, subscription_status: 'active', subscription_expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'user-789', name: 'Ana Costa', email: 'ana@email.com', business_name: 'Espaço Ana Costa', role: 'user', is_active: true, subscription_status: 'pending_payment', subscription_expires_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'user-101', name: 'Pedro Martins', email: 'pedro@email.com', business_name: 'Estética Martins', role: 'user', is_active: false, subscription_status: 'expired', subscription_expires_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'user-112', name: 'Carla Dias', email: 'carla@email.com', business_name: 'Studio Carla', role: 'user', is_active: false, subscription_status: 'canceled', subscription_expires_at: null },
];

// Stages
export const MOCK_STAGES: Stage[] = [
  { id: 'stage-1', title: 'Lead', order: 0, color: STAGE_COLORS[0].name },
  { id: 'stage-2', title: 'Contato Feito', order: 1, color: STAGE_COLORS[1].name },
  { id: 'stage-3', title: 'Avaliação Agendada', order: 2, color: STAGE_COLORS[2].name },
  { id: 'stage-4', title: 'Cliente', order: 3, color: STAGE_COLORS[3].name },
];

// Services
export const MOCK_SERVICES: Service[] = [
  { id: 'serv-1', name: 'Limpeza de Pele Profunda', price: 180, description: 'Extração de cravos e impurezas.' },
  { id: 'serv-2', name: 'Microagulhamento', price: 350, description: 'Estimula o colágeno e melhora a textura da pele.' },
  { id: 'serv-3', name: 'Peeling Químico', price: 250, description: 'Renovação celular para uma pele mais jovem.' },
  { id: 'serv-4', name: 'Drenagem Linfática', price: 150, description: 'Reduz o inchaço e melhora a circulação.' },
];

// Clients
export const MOCK_CLIENTS: Client[] = [
  { id: 'client-1', stage_id: 'stage-1', name: 'Ana Beatriz', phone: '(11) 91234-5678', email: 'ana.b@email.com', treatment: 'Limpeza de Pele Profunda' },
  { id: 'client-2', stage_id: 'stage-2', name: 'Carlos Eduardo', phone: '(21) 98765-4321', email: 'carlos.e@email.com', treatment: 'Microagulhamento' },
  { id: 'client-3', stage_id: 'stage-3', name: 'Daniela Ferreira', phone: '(31) 99999-8888', email: 'daniela.f@email.com', treatment: 'Peeling Químico' },
  { id: 'client-4', stage_id: 'stage-4', name: 'Eduarda Gomes', phone: '(41) 98888-7777', email: 'eduarda.g@email.com', treatment: 'Drenagem Linfática' },
  { id: 'client-5', stage_id: 'stage-4', name: 'Fernanda Lima', phone: '(51) 97777-6666', email: 'fernanda.l@email.com', treatment: 'Limpeza de Pele Profunda' },
];

// Client Tasks
export const MOCK_CLIENT_TASKS: ClientTask[] = [
  { id: 'ctask-1', client_id: 'client-2', title: 'Enviar mensagem de follow-up', completed: false },
  { id: 'ctask-2', client_id: 'client-3', title: 'Confirmar avaliação', completed: true },
  { id: 'ctask-3', client_id: 'client-4', title: 'Verificar satisfação pós-procedimento', completed: false },
];

// Appointments
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt-1', client_id: 'client-3', clientName: 'Daniela Ferreira', treatment: 'Peeling Químico', date: new Date(new Date().setDate(new Date().getDate() + 2)), reminder_minutes_before: 1440, reminder_sent: false },
  { id: 'appt-2', client_id: 'client-4', clientName: 'Eduarda Gomes', treatment: 'Drenagem Linfática', date: new Date(new Date().setHours(10, 0, 0, 0)), reminder_minutes_before: 60, reminder_sent: false },
  { id: 'appt-3', client_id: 'client-5', clientName: 'Fernanda Lima', treatment: 'Limpeza de Pele Profunda', date: new Date(new Date().setHours(14, 30, 0, 0)), reminder_minutes_before: null, reminder_sent: false },
];

// Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'trans-1', type: 'income', amount: 150, description: 'Sessão Drenagem', date: new Date(new Date().setDate(new Date().getDate() - 1)), client_id: 'client-4', service_id: 'serv-4', status: 'paid' },
  { id: 'trans-2', type: 'expense', amount: 80, description: 'Compra de material', date: new Date(new Date().setDate(new Date().getDate() - 3)), client_id: null, service_id: null, status: 'paid' },
  { id: 'trans-3', type: 'income', amount: 180, description: 'Limpeza de Pele', date: new Date(new Date().setDate(new Date().getDate() - 5)), client_id: 'client-5', service_id: 'serv-1', status: 'paid' },
  { id: 'trans-4', type: 'income', amount: 350, description: 'Sinal Microagulhamento', date: new Date(new Date().setDate(new Date().getDate() + 7)), client_id: 'client-2', service_id: 'serv-2', status: 'pending' },
  { id: 'trans-5', type: 'income', amount: 250, description: 'Peeling Químico', date: new Date(new Date().setDate(new Date().getDate() - 10)), client_id: 'client-3', service_id: 'serv-3', status: 'overdue' },
];

// Global Tasks
const today = new Date();
const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
const fiveDaysFromNow = new Date(); fiveDaysFromNow.setDate(today.getDate() + 5);

export const MOCK_TASKS: Task[] = [
  { id: 'task-1', title: 'Comprar novos produtos de peeling', description: 'Verificar os fornecedores A e B para cotação.', completed: false, due_date: today.toISOString() },
  { id: 'task-2', title: 'Organizar estoque de máscaras faciais', description: 'Contar e catalogar todas as máscaras de argila e vitamina C.', completed: false, due_date: yesterday.toISOString() },
  { id: 'task-3', title: 'Planejar posts para redes sociais da semana', completed: true, due_date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
  { id: 'task-4', title: 'Ligar para a cliente Ana Beatriz para follow-up', description: 'Perguntar sobre o resultado da limpeza de pele e oferecer um pacote.', completed: false, due_date: tomorrow.toISOString(), client_id: 'client-1'},
  { id: 'task-5', title: 'Renovar licença do software de gestão', completed: false, due_date: fiveDaysFromNow.toISOString() },
  { id: 'task-6', title: 'Limpar os filtros do ar condicionado', completed: false },
];

// Notes
export const MOCK_NOTES: Note[] = [
  { id: 'note-1', client_id: 'client-4', title: 'Alergia a ácido salicílico', content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Cliente Eduarda relatou ter sensibilidade e alergia a produtos que contenham ácido salicílico. Evitar em futuros tratamentos."}]}]}', type: 'standard', tags: ['alergia'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'note-2', client_id: 'client-5', title: 'Preferências da Cliente', content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Fernanda gosta de música ambiente relaxante durante os procedimentos e prefere a maca um pouco mais inclinada."}]}]}', type: 'standard', tags: ['preferências'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Prescription Template
export const MOCK_PRESCRIPTION_TEMPLATE: PrescriptionTemplate = {
    id: 'template-1',
    user_id: 'user-123',
    template_data: {
        business_name: MOCK_USER_PROFILE.business_name,
        professional_name: MOCK_USER_PROFILE.name,
        professional_info: 'Esteticista Cosmetóloga',
        address: MOCK_USER_PROFILE.business_address || '',
        contact_info: `Tel: ${MOCK_USER_PROFILE.business_phone} | Email: ${MOCK_USER_PROFILE.business_email}`,
        font_family: 'Poppins, sans-serif'
    }
};