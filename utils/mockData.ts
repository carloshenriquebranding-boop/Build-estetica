

import type { Stage, Client, ClientTask, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData, WhatsappChat, WhatsappMessage, Budget } from '../types.ts';

// --- IDs ---
const userId = 'mock-user-id-123';
const stageIds = {
  new: 'stage-1',
  contacted: 'stage-2',
  negotiation: 'stage-3',
  closed: 'stage-4',
  lost: 'stage-5',
  qualificacao: 'stage-6',
  frios: 'stage-7',
};

const serviceIds = {
  limpeza: 'service-1',
  botox: 'service-2',
  preenchimento: 'service-3',
  peeling: 'service-4',
  microagulhamento: 'service-5',
  drenagem: 'service-6',
  massagem: 'service-7',
  sobrancelha: 'service-8',
  radiofrequencia: 'service-9',
  jato: 'service-10',
};

const clientIds = Array.from({ length: 15 }, (_, i) => `client-${i + 1}`);
const chatIds = {
  ana: 'chat-1',
  bruno: 'chat-2',
  daniela: 'chat-3',
  gabriel: 'chat-4',
};

// --- Mock Data ---

export const mockStages: Stage[] = [
  { id: stageIds.new, user_id: userId, title: 'Novo Contato', order: 0, color: 'indigo' },
  { id: stageIds.qualificacao, user_id: userId, title: 'Qualificação', order: 1, color: 'purple' },
  { id: stageIds.contacted, user_id: userId, title: 'Contato Feito', order: 2, color: 'pink' },
  { id: stageIds.negotiation, user_id: userId, title: 'Negociação', order: 3, color: 'yellow' },
  { id: stageIds.closed, user_id: userId, title: 'Cliente Fechado', order: 4, color: 'green' },
  { id: stageIds.frios, user_id: userId, title: 'Leads Frios', order: 5, color: 'blue' },
  { id: stageIds.lost, user_id: userId, title: 'Perdido', order: 6, color: 'gray' },
];

export const mockServices: Service[] = [
  { id: serviceIds.limpeza, user_id: userId, name: 'Limpeza de Pele Profunda', price: 180.00, description: 'Extração de cravos e impurezas com hidratação.' },
  { id: serviceIds.botox, user_id: userId, name: 'Aplicação de Botox', price: 1200.00, description: 'Toxina botulínica para rugas de expressão (terço superior).' },
  { id: serviceIds.preenchimento, user_id: userId, name: 'Preenchimento Labial', price: 950.00, description: 'Ácido hialurônico para volume e contorno (1ml).' },
  { id: serviceIds.peeling, user_id: userId, name: 'Peeling Químico', price: 350.00, description: 'Renovação celular com ácidos para manchas e textura.' },
  { id: serviceIds.microagulhamento, user_id: userId, name: 'Microagulhamento', price: 450.00, description: 'Estimulação de colágeno para cicatrizes e rejuvenescimento.' },
  { id: serviceIds.drenagem, user_id: userId, name: 'Drenagem Linfática', price: 150.00, description: 'Massagem para redução de inchaço e retenção de líquidos.' },
  { id: serviceIds.massagem, user_id: userId, name: 'Massagem Modeladora', price: 160.00, description: 'Massagem vigorosa para contorno corporal e celulite.' },
  { id: serviceIds.sobrancelha, user_id: userId, name: 'Micropigmentação de Sobrancelhas', price: 750.00, description: 'Técnica fio a fio para preenchimento e design.' },
  { id: serviceIds.radiofrequencia, user_id: userId, name: 'Radiofrequência Facial', price: 250.00, description: 'Tratamento para flacidez e estímulo de colágeno.' },
  { id: serviceIds.jato, user_id: userId, name: 'Jato de Plasma', price: 400.00, description: 'Remoção de sinais, manchas e blefaroplastia sem cortes.' },
];

export const mockClients: Client[] = [
  { id: clientIds[0], stage_id: stageIds.new, user_id: userId, name: 'Ana Carolina Souza', phone: '(11) 98765-4321', email: 'ana.souza@email.com', treatment: 'Limpeza de Pele Profunda', created_at: new Date().toISOString(), order: 0 },
  { id: clientIds[1], stage_id: stageIds.qualificacao, user_id: userId, name: 'Bruno Alves', phone: '(21) 91234-5678', email: 'bruno.alves@email.com', treatment: 'Peeling Químico', created_at: new Date().toISOString(), order: 1 },
  { id: clientIds[11], stage_id: stageIds.new, user_id: userId, name: 'Lucas Mendes', phone: '(31) 98765-1234', email: 'lucas.mendes@email.com', treatment: 'Massagem Modeladora', created_at: new Date().toISOString(), order: 2 },
  
  { id: clientIds[2], stage_id: stageIds.contacted, user_id: userId, name: 'Carla Dias', phone: '(31) 99988-7766', email: 'carla.dias@email.com', treatment: 'Aplicação de Botox', created_at: new Date().toISOString(), order: 0 },
  { id: clientIds[3], stage_id: stageIds.contacted, user_id: userId, name: 'Daniela Ferreira', phone: '(41) 98877-6655', email: 'daniela.f@email.com', treatment: 'Microagulhamento', created_at: new Date().toISOString(), order: 1 },
  { id: clientIds[12], stage_id: stageIds.frios, user_id: userId, name: 'Mariana Azevedo', phone: '(41) 95432-1098', email: 'mari.azevedo@email.com', treatment: 'Radiofrequência Facial', created_at: new Date().toISOString(), order: 2 },

  { id: clientIds[4], stage_id: stageIds.negotiation, user_id: userId, name: 'Eduardo Lima', phone: '(51) 97766-5544', email: 'edu.lima@email.com', treatment: 'Preenchimento Labial', address: 'Rua das Flores, 123, Porto Alegre, RS', created_at: new Date().toISOString(), order: 0 },
  { id: clientIds[5], stage_id: stageIds.negotiation, user_id: userId, name: 'Fernanda Lima', phone: '(61) 96655-4433', email: 'fernanda.lima@email.com', treatment: 'Aplicação de Botox', created_at: new Date().toISOString(), order: 1 },
  { id: clientIds[13], stage_id: stageIds.negotiation, user_id: userId, name: 'Nicolas Barros', phone: '(51) 93210-9876', email: 'nicolas.b@email.com', treatment: 'Aplicação de Botox', created_at: new Date().toISOString(), order: 2 },
  
  { id: clientIds[6], stage_id: stageIds.closed, user_id: userId, name: 'Gabriel Costa', phone: '(71) 95544-3322', email: 'gabriel.costa@email.com', treatment: 'Drenagem Linfática', created_at: new Date().toISOString(), order: 0 },
  { id: clientIds[7], stage_id: stageIds.closed, user_id: userId, name: 'Helena Martins', phone: '(81) 94433-2211', email: 'helena.m@email.com', treatment: 'Microagulhamento', created_at: new Date().toISOString(), order: 1 },
  { id: clientIds[8], stage_id: stageIds.closed, user_id: userId, name: 'Isabela Rocha', phone: '(91) 93322-1100', email: 'isabela.rocha@email.com', treatment: 'Peeling Químico', created_at: new Date().toISOString(), order: 2 },
  { id: clientIds[9], stage_id: stageIds.closed, user_id: userId, name: 'João Pedro Santos', phone: '(11) 92211-0099', email: 'joao.santos@email.com', treatment: 'Jato de Plasma', created_at: new Date().toISOString(), order: 3 },
  { id: clientIds[14], stage_id: stageIds.closed, user_id: userId, name: 'Olivia Pereira', phone: '(61) 92109-8765', email: 'olivia.p@email.com', treatment: 'Micropigmentação de Sobrancelhas', created_at: new Date().toISOString(), order: 4 },
  
  { id: clientIds[10], stage_id: stageIds.lost, user_id: userId, name: 'Karen Oliveira', phone: '(21) 91100-9988', email: 'karen.o@email.com', treatment: 'Preenchimento Labial', created_at: new Date().toISOString(), order: 0 },
];

const today = new Date();
const getDate = (dayOffset: number, hour: number, minute: number = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const mockAppointments: Appointment[] = [
  // Hoje
  { id: 'appt-1', client_id: clientIds[6], clientName: 'Gabriel Costa', treatment: 'Drenagem Linfática', date: getDate(0, 10, 0), reminder_minutes_before: 60, reminder_sent: true, notes: 'Cliente com pele sensível.' },
  { id: 'appt-2', client_id: clientIds[7], clientName: 'Helena Martins', treatment: 'Microagulhamento', date: getDate(0, 14, 30), reminder_minutes_before: 120, reminder_sent: false, notes: '' },
  { id: 'appt-20', client_id: clientIds[2], clientName: 'Carla Dias', treatment: 'Avaliação Botox', date: getDate(0, 16, 0), reminder_minutes_before: null, reminder_sent: false, notes: 'Primeira avaliação.' },
  
  // Próximos 7 dias
  { id: 'appt-3', client_id: clientIds[8], clientName: 'Isabela Rocha', treatment: 'Peeling Químico', date: getDate(1, 10, 0), reminder_minutes_before: 1440, reminder_sent: false, notes: 'Retorno.' },
  { id: 'appt-4', client_id: clientIds[9], clientName: 'João Pedro Santos', treatment: 'Jato de Plasma', date: getDate(2, 11, 0), reminder_minutes_before: null, reminder_sent: false, notes: '' },
  { id: 'appt-5', client_id: clientIds[0], clientName: 'Ana Carolina Souza', treatment: 'Avaliação', date: getDate(3, 9, 30), reminder_minutes_before: 1440, reminder_sent: false, notes: '' },
  { id: 'appt-6', client_id: clientIds[14], clientName: 'Olivia Pereira', treatment: 'Micropigmentação de Sobrancelhas', date: getDate(3, 15, 0), reminder_minutes_before: 60, reminder_sent: false, notes: '' },
  { id: 'appt-7', client_id: clientIds[1], clientName: 'Bruno Alves', treatment: 'Peeling Químico', date: getDate(4, 13, 0), reminder_minutes_before: 1440, reminder_sent: false, notes: 'Foco em manchas de acne.' },
  { id: 'appt-8', client_id: clientIds[4], clientName: 'Eduardo Lima', treatment: 'Preenchimento Labial', date: getDate(5, 17, 0), reminder_minutes_before: 2880, reminder_sent: false, notes: '' },
  { id: 'appt-9', client_id: clientIds[12], clientName: 'Mariana Azevedo', treatment: 'Radiofrequência Facial', date: getDate(6, 11, 30), reminder_minutes_before: 1440, reminder_sent: false, notes: 'Sessão 2 de 5' },
  { id: 'appt-10', client_id: clientIds[13], clientName: 'Nicolas Barros', treatment: 'Aplicação de Botox', date: getDate(7, 18, 0), reminder_minutes_before: null, reminder_sent: false, notes: 'Retoque' },

  // Semana passada
  { id: 'appt-11', client_id: clientIds[11], clientName: 'Lucas Mendes', treatment: 'Massagem Modeladora', date: getDate(-2, 14, 0), reminder_minutes_before: 60, reminder_sent: true, notes: '' },
  { id: 'appt-12', client_id: clientIds[3], clientName: 'Daniela Ferreira', treatment: 'Microagulhamento', date: getDate(-3, 16, 0), reminder_minutes_before: 1440, reminder_sent: true, notes: '' },
  { id: 'appt-13', client_id: clientIds[5], clientName: 'Fernanda Lima', treatment: 'Avaliação Botox', date: getDate(-5, 9, 0), reminder_minutes_before: null, reminder_sent: true, notes: '' },

  // Futuros (mês que vem)
  { id: 'appt-14', client_id: clientIds[6], clientName: 'Gabriel Costa', treatment: 'Drenagem Linfática', date: getDate(10, 10, 0), reminder_minutes_before: 1440, reminder_sent: false, notes: 'Sessão de manutenção.' },
  { id: 'appt-15', client_id: clientIds[8], clientName: 'Isabela Rocha', treatment: 'Retorno Peeling', date: getDate(15, 11, 0), reminder_minutes_before: 2880, reminder_sent: false, notes: '' },
];


export const mockTransactions: Transaction[] = [
  // Receitas
  { id: 'trans-1', user_id: userId, type: 'income', amount: 180, description: 'Sessão Limpeza de Pele', date: getDate(-15, 0), client_id: clientIds[0], service_id: serviceIds.limpeza, status: 'paid', created_at: getDate(-15, 0).toISOString() },
  { id: 'trans-3', user_id: userId, type: 'income', amount: 450, description: 'Sessão Microagulhamento', date: getDate(-12, 0), client_id: clientIds[7], service_id: serviceIds.microagulhamento, status: 'paid', created_at: getDate(-12, 0).toISOString() },
  { id: 'trans-4', user_id: userId, type: 'income', amount: 750, description: 'Micropigmentação de Sobrancelhas', date: getDate(-10, 0), client_id: clientIds[14], service_id: serviceIds.sobrancelha, status: 'paid', created_at: getDate(-10, 0).toISOString() },
  { id: 'trans-6', user_id: userId, type: 'income', amount: 1200, description: 'Aplicação de Botox', date: getDate(-8, 0), client_id: clientIds[5], service_id: serviceIds.botox, status: 'paid', created_at: getDate(-8, 0).toISOString() },
  { id: 'trans-8', user_id: userId, type: 'income', amount: 160, description: 'Massagem Modeladora', date: getDate(-5, 0), client_id: clientIds[11], service_id: serviceIds.massagem, status: 'paid', created_at: getDate(-5, 0).toISOString() },
  { id: 'trans-10', user_id: userId, type: 'income', amount: 350, description: 'Sessão Peeling Químico', date: getDate(-2, 0), client_id: clientIds[8], service_id: serviceIds.peeling, status: 'pending', created_at: getDate(-2, 0).toISOString() },
  { id: 'trans-11', user_id: userId, type: 'income', amount: 950, description: 'Preenchimento Labial', date: getDate(-20, 0), client_id: clientIds[4], service_id: serviceIds.preenchimento, status: 'overdue', created_at: getDate(-20, 0).toISOString() },
  { id: 'trans-13', user_id: userId, type: 'income', amount: 250, description: 'Radiofrequência Facial', date: getDate(5, 0), client_id: clientIds[12], service_id: serviceIds.radiofrequencia, status: 'pending', created_at: getDate(-1, 0).toISOString() },
  { id: 'trans-15', user_id: userId, type: 'income', amount: 150, description: 'Drenagem Linfática', date: getDate(0, 0), client_id: clientIds[6], service_id: serviceIds.drenagem, status: 'paid', created_at: getDate(0, 0).toISOString() },

  // Despesas
  { id: 'trans-2', user_id: userId, type: 'expense', amount: 350.50, description: 'Compra de produtos (fornecedor A)', date: getDate(-14, 0), client_id: null, service_id: null, status: 'paid', created_at: getDate(-14, 0).toISOString() },
  { id: 'trans-5', user_id: userId, type: 'expense', amount: 80, description: 'Anúncio Instagram', date: getDate(-7, 0), client_id: null, service_id: null, status: 'paid', created_at: getDate(-7, 0).toISOString() },
  { id: 'trans-7', user_id: userId, type: 'expense', amount: 1500, description: 'Aluguel do espaço', date: getDate(-5, 0), client_id: null, service_id: null, status: 'paid', created_at: getDate(-5, 0).toISOString() },
  { id: 'trans-9', user_id: userId, type: 'expense', amount: 120.90, description: 'Material de escritório', date: getDate(-3, 0), client_id: null, service_id: null, status: 'paid', created_at: getDate(-3, 0).toISOString() },
  { id: 'trans-12', user_id: userId, type: 'expense', amount: 250, description: 'Manutenção de equipamento', date: getDate(-1, 0), client_id: null, service_id: null, status: 'paid', created_at: getDate(-1, 0).toISOString() },
  { id: 'trans-14', user_id: userId, type: 'expense', amount: 95.00, description: 'Conta de Internet/Telefone', date: getDate(1, 0), client_id: null, service_id: null, status: 'paid', created_at: getDate(1, 0).toISOString() },
];

export const mockTasks: Task[] = [
  { id: 'task-1', user_id: userId, title: 'Comprar novos produtos de peeling', description: 'Verificar estoque e fazer pedido com fornecedor Bel Col.', completed: false, due_date: getDate(2, 0).toISOString().split('T')[0], created_at: getDate(-1, 0).toISOString() },
  { id: 'task-2', user_id: userId, title: 'Planejar posts da semana para Instagram', description: 'Foco em promoção de Radiofrequência.', completed: false, due_date: getDate(1, 0).toISOString().split('T')[0], created_at: getDate(-2, 0).toISOString() },
  { id: 'task-3', user_id: userId, title: 'Pagar conta de luz', completed: true, due_date: getDate(-1, 0).toISOString().split('T')[0], created_at: getDate(-3, 0).toISOString() },
  { id: 'task-4', user_id: userId, title: 'Ligar para a cliente Carla Dias', description: 'Follow up sobre o orçamento de Botox.', completed: false, due_date: getDate(0, 0).toISOString().split('T')[0], client_id: clientIds[2], created_at: getDate(-4, 0).toISOString() },
  { id: 'task-5', user_id: userId, title: 'Organizar armário de estoque', completed: false, due_date: null, created_at: getDate(-5, 0).toISOString() },
  { id: 'task-6', user_id: userId, title: 'Confirmar agendamentos de amanhã', completed: true, due_date: getDate(-1, 0).toISOString().split('T')[0], client_id: null, created_at: getDate(-1, 0).toISOString() },
  { id: 'task-7', user_id: userId, title: 'Enviar orçamento para Eduardo Lima', completed: false, due_date: getDate(0, 0).toISOString().split('T')[0], client_id: clientIds[4], created_at: getDate(0, 0).toISOString() },
  { id: 'task-8', user_id: userId, title: 'Pesquisar novos cursos de aperfeiçoamento', completed: false, due_date: getDate(15, 0).toISOString().split('T')[0], client_id: null, created_at: getDate(-3, 0).toISOString() },
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
   {
    id: 'note-4', user_id: userId, client_id: clientIds[4], title: 'Preferências - Eduardo Lima',
    content: JSON.stringify({ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Cliente prefere música ambiente mais calma durante os procedimentos. Gosta de chá de camomila." }] }] }),
    type: 'standard', tags: ['preferências'], created_at: getDate(-20, 0).toISOString(), updated_at: getDate(-20, 0).toISOString(),
  },
];

export const mockBudgets: Budget[] = [
    {
        id: 'budget-1', user_id: userId, client_id: clientIds[2], template_id: 'classic',
        items: [
            { id: 'i1', name: 'Aplicação de Botox', description: 'Terço superior (testa, glabela, olhos)', quantity: 1, unit_price: 1200 },
            { id: 'i2', name: 'Limpeza de Pele Profunda', description: 'Preparação para o procedimento', quantity: 1, unit_price: 180 },
        ],
        total: 1380, status: 'sent', created_at: getDate(-4, 0).toISOString(), updated_at: getDate(-4, 0).toISOString(),
    },
    {
        id: 'budget-2', user_id: userId, client_id: clientIds[13], template_id: 'modern',
        items: [
            { id: 'i3', name: 'Pacote Rejuvenescimento', description: '3 sessões de Radiofrequência', quantity: 1, unit_price: 650 },
        ],
        total: 650, status: 'approved', created_at: getDate(-10, 0).toISOString(), updated_at: getDate(-9, 0).toISOString(),
    },
    {
        id: 'budget-3', user_id: userId, client_id: clientIds[4], template_id: 'creative',
        items: [
            { id: 'i4', name: 'Preenchimento Labial', description: '1ml de ácido hialurônico', quantity: 1, unit_price: 950 },
        ],
        total: 950, status: 'draft', created_at: getDate(-1, 0).toISOString(), updated_at: getDate(-1, 0).toISOString(),
    },
    {
        id: 'budget-4', user_id: userId, client_id: clientIds[10], template_id: 'classic',
        items: [
            { id: 'i5', name: 'Jato de Plasma', description: 'Remoção de 3 sinais', quantity: 1, unit_price: 400 },
        ],
        total: 400, status: 'rejected', created_at: getDate(-15, 0).toISOString(), updated_at: getDate(-14, 0).toISOString(),
    }
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
      primaryColor: '#db2777',
      secondaryColor: '#fdf2f8',
      textColor: '#1e293b',
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
        id: chatIds.ana, user_id: userId, contact_name: 'Ana Carolina Souza', contact_phone: '(11) 98765-4321',
        last_message: 'Oi, gostaria de saber mais sobre a limpeza de pele.',
        last_message_at: getDate(0, 9, 15).toISOString(), unread_count: 2, created_at: getDate(-1, 0).toISOString(),
    },
    {
        id: chatIds.bruno, user_id: userId, contact_name: 'Bruno Alves', contact_phone: '(21) 91234-5678',
        last_message: 'Ok, obrigado!', last_message_at: getDate(0, 10, 5).toISOString(), unread_count: 0, created_at: getDate(-2, 0).toISOString(),
    },
    {
        id: chatIds.daniela, user_id: userId, contact_name: 'Daniela Ferreira', contact_phone: '(41) 98877-6655',
        last_message: 'Perfeito, agendado então!', last_message_at: getDate(-1, 17, 30).toISOString(), unread_count: 0, created_at: getDate(-3, 0).toISOString(),
    },
    {
        id: chatIds.gabriel, user_id: userId, contact_name: 'Gabriel Costa', contact_phone: '(71) 95544-3322',
        last_message: 'Qual o valor da drenagem?', last_message_at: getDate(0, 11, 20).toISOString(), unread_count: 1, created_at: getDate(0, 0).toISOString(),
    }
];

export const mockWhatsappMessages: { [key: string]: WhatsappMessage[] } = {
  [chatIds.ana]: [
    { id: 'msg-a1', chat_id: chatIds.ana, user_id: userId, content: 'Oi, gostaria de saber mais sobre a limpeza de pele.', is_from_me: false, created_at: getDate(0, 9, 14).toISOString() },
    { id: 'msg-a2', chat_id: chatIds.ana, user_id: userId, content: 'É 180 reais.', is_from_me: true, created_at: getDate(0, 9, 15).toISOString() },
  ],
  [chatIds.bruno]: [
    { id: 'msg-b1', chat_id: chatIds.bruno, user_id: userId, content: 'Olá Bruno, sua sessão de peeling está confirmada para sexta!', is_from_me: true, created_at: getDate(0, 10, 4).toISOString() },
    { id: 'msg-b2', chat_id: chatIds.bruno, user_id: userId, content: 'Ok, obrigado!', is_from_me: false, created_at: getDate(0, 10, 5).toISOString() },
  ],
  [chatIds.daniela]: [
    { id: 'msg-d1', chat_id: chatIds.daniela, user_id: userId, content: 'Daniela, tudo bem? Podemos agendar seu microagulhamento?', is_from_me: true, created_at: getDate(-1, 17, 28).toISOString() },
    { id: 'msg-d2', chat_id: chatIds.daniela, user_id: userId, content: 'Oii, podemos sim! Pode ser na terça que vem?', is_from_me: false, created_at: getDate(-1, 17, 29).toISOString() },
    { id: 'msg-d3', chat_id: chatIds.daniela, user_id: userId, content: 'Perfeito, agendado então!', is_from_me: true, created_at: getDate(-1, 17, 30).toISOString() },
  ],
  [chatIds.gabriel]: [
    { id: 'msg-g1', chat_id: chatIds.gabriel, user_id: userId, content: 'Qual o valor da drenagem?', is_from_me: false, created_at: getDate(0, 11, 20).toISOString() },
  ]
};