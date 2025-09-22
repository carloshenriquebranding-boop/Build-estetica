import type { Stage, Client, ClientTask, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData, WhatsappChat, WhatsappMessage } from '../types.ts';

// --- IDs ---
const userId = 'mock-user-id-123';
const stageIds = {
  new: 'stage-1',
  contacted: 'stage-2',
  negotiation: 'stage-3',
  closed: 'stage-4',
  lost: 'stage-5',
};

const serviceIds = {
  limpeza: 'service-1',
  botox: 'service-2',
  preenchimento: 'service-3',
  peeling: 'service-4',
  micro: 'service-5',
};

const clientIds = Array.from({ length: 15 }, (_, i) => `client-${i + 1}`);

// --- Mock Data ---

export const mockStages: Stage[] = [
  { id: stageIds.new, title: 'Novo Contato', order: 0, color: 'blue' },
  { id: stageIds.contacted, title: 'Contato Feito', order: 1, color: 'purple' },
  { id: stageIds.negotiation, title: 'Negociação', order: 2, color: 'yellow' },
  { id: stageIds.closed, title: 'Cliente Fechado', order: 3, color: 'green' },
  { id: stageIds.lost, title: 'Perdido', order: 4, color: 'gray' },
];

export const mockServices: Service[] = [
  { id: serviceIds.limpeza, name: 'Limpeza de Pele Profunda', price: 180.00, description: 'Extração de cravos e impurezas.' },
  { id: serviceIds.botox, name: 'Aplicação de Botox', price: 1200.00, description: 'Toxina botulínica para rugas de expressão.' },
  { id: serviceIds.preenchimento, name: 'Preenchimento Labial', price: 950.00, description: 'Ácido hialurônico para volume e contorno.' },
  { id: serviceIds.peeling, name: 'Peeling Químico', price: 350.00, description: 'Renovação celular com ácidos.' },
  { id: serviceIds.micro, name: 'Microagulhamento', price: 450.00, description: 'Estimulação de colágeno para cicatrizes e rejuvenescimento.' },
];

export const mockClients: Client[] = [
  { id: clientIds[0], stage_id: stageIds.new, user_id: userId, name: 'Ana Carolina Souza', phone: '(11) 98765-4321', email: 'ana.souza@email.com', treatment: 'Limpeza de Pele Profunda' },
  { id: clientIds[1], stage_id: stageIds.new, user_id: userId, name: 'Bruno Alves', phone: '(21) 91234-5678', email: 'bruno.alves@email.com', treatment: 'Peeling Químico' },
  { id: clientIds[2], stage_id: stageIds.contacted, user_id: userId, name: 'Carla Dias', phone: '(31) 99988-7766', email: 'carla.dias@email.com', treatment: 'Aplicação de Botox' },
  { id: clientIds[3], stage_id: stageIds.contacted, user_id: userId, name: 'Daniela Ferreira', phone: '(41) 98877-6655', email: 'daniela.f@email.com', treatment: 'Microagulhamento' },
  { id: clientIds[4], stage_id: stageIds.negotiation, user_id: userId, name: 'Eduardo Lima', phone: '(51) 97766-5544', email: 'edu.lima@email.com', treatment: 'Preenchimento Labial', address: 'Rua das Flores, 123, Porto Alegre, RS' },
  { id: clientIds[5], stage_id: stageIds.negotiation, user_id: userId, name: 'Fernanda Lima', phone: '(61) 96655-4433', email: 'fernanda.lima@email.com', treatment: 'Aplicação de Botox' },
  { id: clientIds[6], stage_id: stageIds.closed, user_id: userId, name: 'Gabriel Costa', phone: '(71) 95544-3322', email: 'gabriel.costa@email.com', treatment: 'Limpeza de Pele Profunda' },
  { id: clientIds[7], stage_id: stageIds.closed, user_id: userId, name: 'Helena Martins', phone: '(81) 94433-2211', email: 'helena.m@email.com', treatment: 'Microagulhamento' },
  { id: clientIds[8], stage_id: stageIds.closed, user_id: userId, name: 'Isabela Rocha', phone: '(91) 93322-1100', email: 'isabela.rocha@email.com', treatment: 'Peeling Químico' },
  { id: clientIds[9], stage_id: stageIds.closed, user_id: userId, name: 'João Pedro Santos', phone: '(11) 92211-0099', email: 'joao.santos@email.com', treatment: 'Aplicação de Botox' },
  { id: clientIds[10], stage_id: stageIds.lost, user_id: userId, name: 'Karen Oliveira', phone: '(21) 91100-9988', email: 'karen.o@email.com', treatment: 'Preenchimento Labial' },
  { id: clientIds[11], stage_id: stageIds.new, user_id: userId, name: 'Lucas Mendes', phone: '(31) 98765-1234', email: 'lucas.mendes@email.com', treatment: 'Limpeza de Pele Profunda' },
  { id: clientIds[12], stage_id: stageIds.contacted, user_id: userId, name: 'Mariana Azevedo', phone: '(41) 95432-1098', email: 'mari.azevedo@email.com', treatment: 'Microagulhamento' },
  { id: clientIds[13], stage_id: stageIds.negotiation, user_id: userId, name: 'Nicolas Barros', phone: '(51) 93210-9876', email: 'nicolas.b@email.com', treatment: 'Aplicação de Botox' },
  { id: clientIds[14], stage_id: stageIds.closed, user_id: userId, name: 'Olivia Pereira', phone: '(61) 92109-8765', email: 'olivia.p@email.com', treatment: 'Peeling Químico' },
];

export const mockClientTasks: ClientTask[] = [
  { id: 'ctask-1', client_id: clientIds[2], title: 'Enviar orçamento do Botox', completed: false },
  { id: 'ctask-2', client_id: clientIds[2], title: 'Confirmar data da avaliação', completed: true },
  { id: 'ctask-3', client_id: clientIds[4], title: 'Ligar para follow-up', completed: false },
  { id: 'ctask-4', client_id: clientIds[6], title: 'Agendar retorno pós-procedimento', completed: true },
];

const today = new Date();
const getDate = (dayOffset: number, hour: number, minute: number = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const mockAppointments: Appointment[] = [
  { id: 'appt-1', client_id: clientIds[6], clientName: 'Gabriel Costa', treatment: 'Limpeza de Pele Profunda', date: getDate(0, 14, 0), reminder_minutes_before: 60, reminder_sent: false, notes: 'Cliente com pele sensível.' },
  { id: 'appt-2', client_id: clientIds[7], clientName: 'Helena Martins', treatment: 'Microagulhamento', date: getDate(0, 16, 30), reminder_minutes_before: 120, reminder_sent: false, notes: '' },
  { id: 'appt-3', client_id: clientIds[8], clientName: 'Isabela Rocha', treatment: 'Peeling Químico', date: getDate(1, 10, 0), reminder_minutes_before: 1440, reminder_sent: false, notes: 'Retorno.' },
  { id: 'appt-4', client_id: clientIds[9], clientName: 'João Pedro Santos', treatment: 'Aplicação de Botox', date: getDate(2, 11, 0), reminder_minutes_before: null, reminder_sent: false, notes: '' },
  { id: 'appt-5', client_id: clientIds[0], clientName: 'Ana Carolina Souza', treatment: 'Avaliação', date: getDate(3, 9, 30), reminder_minutes_before: 1440, reminder_sent: false, notes: '' },
  { id: 'appt-6', client_id: clientIds[14], clientName: 'Olivia Pereira', treatment: 'Peeling Químico', date: getDate(3, 15, 0), reminder_minutes_before: 60, reminder_sent: false, notes: '' },
];

export const mockTransactions: Transaction[] = [
  { id: 'trans-1', type: 'income', amount: 180, description: 'Sessão Limpeza de Pele', date: getDate(-5, 0), client_id: clientIds[6], service_id: serviceIds.limpeza, status: 'paid' },
  { id: 'trans-2', type: 'expense', amount: 250, description: 'Compra de produtos', date: getDate(-4, 0), client_id: null, service_id: null, status: 'paid' },
  { id: 'trans-3', type: 'income', amount: 450, description: 'Sessão Microagulhamento', date: getDate(-3, 0), client_id: clientIds[7], service_id: serviceIds.micro, status: 'paid' },
  { id: 'trans-4', type: 'income', amount: 350, description: 'Sessão Peeling Químico', date: getDate(-2, 0), client_id: clientIds[8], service_id: serviceIds.peeling, status: 'pending' },
  { id: 'trans-5', type: 'expense', amount: 80, description: 'Marketing Digital', date: getDate(-1, 0), client_id: null, service_id: null, status: 'paid' },
];

export const mockTasks: Task[] = [
  { id: 'task-1', title: 'Comprar novos produtos de peeling', description: 'Verificar estoque e fazer pedido com fornecedor.', completed: false, due_date: getDate(2, 0).toISOString().split('T')[0] },
  { id: 'task-2', title: 'Planejar posts da semana para Instagram', description: '', completed: false, due_date: getDate(1, 0).toISOString().split('T')[0] },
  { id: 'task-3', title: 'Pagar conta de luz', completed: true, due_date: getDate(-1, 0).toISOString().split('T')[0] },
  { id: 'task-4', title: 'Ligar para a cliente Carla Dias', description: 'Follow up sobre o orçamento de Botox.', completed: false, due_date: getDate(0, 0).toISOString().split('T')[0], client_id: clientIds[2] },
  { id: 'task-5', title: 'Organizar armário de estoque', completed: false, due_date: null },
];

export const mockNotes: Note[] = [
  {
    id: 'note-1', user_id: userId, client_id: clientIds[6], title: 'Alergias - Gabriel Costa',
    content: JSON.stringify({ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Cliente relatou alergia a produtos com base de enxofre. Evitar durante os procedimentos." }] }] }),
    type: 'standard', tags: ['alergia', 'importante'], created_at: getDate(-10, 0).toISOString(), updated_at: getDate(-10, 0).toISOString(),
  },
  {
    id: 'note-2', user_id: userId, client_id: clientIds[7], title: `Prescrição Pós-Microagulhamento - Helena Martins`,
    content: JSON.stringify({ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "1. Usar protetor solar FPS 50 a cada 3 horas.\n2. Evitar exposição solar direta por 7 dias.\n3. Aplicar creme cicatrizante (Cicaplast) à noite." }] }] }),
    type: 'prescription', tags: ['prescrição', 'microagulhamento'], created_at: getDate(-3, 0).toISOString(), updated_at: getDate(-3, 0).toISOString(),
  },
  {
    id: 'note-3', user_id: userId, client_id: null, title: 'Ideias de Conteúdo para Redes Sociais',
    content: JSON.stringify({ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Falar sobre os mitos do Botox. Mostrar antes e depois de preenchimento labial. Fazer um post sobre a importância da limpeza de pele." }] }] }),
    type: 'standard', tags: ['marketing', 'ideias'], created_at: getDate(-5, 0).toISOString(), updated_at: getDate(-5, 0).toISOString(),
  },
];

export const mockUserProfile: UserProfile = {
  id: userId,
  name: 'Dra. Estela',
  email: 'estela@esteticacrm.com',
  business_email: 'contato@clinicaestela.com',
  avatar_url: null,
  business_name: 'Clínica Estela',
  business_phone: '(11) 5555-1234',
  business_address: 'Av. Paulista, 1000 - São Paulo, SP',
  role: 'admin',
  is_active: true,
  subscription_status: 'active',
  subscription_expires_at: getDate(30, 0).toISOString(),
  budget_template: {
      primaryColor: '#db2777', // pink-600
      secondaryColor: '#fdf2f8', // pink-50
      textColor: '#1e293b', // slate-800
      fontFamily: 'Poppins, sans-serif',
      logoUrl: null,
  }
};

export const mockPrescriptionTemplate: PrescriptionTemplate = {
    id: 'template-1',
    user_id: userId,
    template_data: {
        business_name: 'Clínica Estela',
        professional_name: 'Dra. Estela',
        professional_info: 'Biomédica Esteta | CRBM 12345',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        contact_info: '(11) 5555-1234 | contato@clinicaestela.com',
        font_family: 'Poppins',
    }
};

export const mockWhatsappChats: WhatsappChat[] = [
    {
        id: 'chat-1',
        user_id: userId,
        contact_name: 'Ana Carolina Souza',
        contact_phone: '(11) 98765-4321',
        last_message: 'Oi, gostaria de saber mais sobre a limpeza de pele.',
        last_message_at: getDate(0, 9, 15).toISOString(),
        unread_count: 2,
        created_at: getDate(-1, 0).toISOString(),
    },
    {
        id: 'chat-2',
        user_id: userId,
        contact_name: 'Daniela Ferreira',
        contact_phone: '(41) 98877-6655',
        last_message: 'Ok, obrigada!',
        last_message_at: getDate(-1, 18, 30).toISOString(),
        unread_count: 0,
        created_at: getDate(-2, 0).toISOString(),
    }
];

export const mockWhatsappMessages: WhatsappMessage[] = [
    { id: 'msg-1', chat_id: 'chat-1', user_id: userId, content: 'Oi, gostaria de saber mais sobre a limpeza de pele.', is_from_me: false, created_at: getDate(0, 9, 15).toISOString() },
    { id: 'msg-2', chat_id: 'chat-1', user_id: userId, content: 'Claro, Ana! Nossa limpeza profunda custa R$180 e dura cerca de 1h. Você gostaria de agendar uma avaliação?', is_from_me: true, created_at: getDate(0, 9, 16).toISOString() },
    // For chat-2
    { id: 'msg-3', chat_id: 'chat-2', user_id: userId, content: 'Sua avaliação para microagulhamento está confirmada para amanhã às 10h.', is_from_me: true, created_at: getDate(-1, 18, 29).toISOString() },
    { id: 'msg-4', chat_id: 'chat-2', user_id: userId, content: 'Ok, obrigada!', is_from_me: false, created_at: getDate(-1, 18, 30).toISOString() },
];