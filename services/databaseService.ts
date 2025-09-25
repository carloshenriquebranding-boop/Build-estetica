// services/databaseService.ts
import type { Stage, Client, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData, Budget, WhatsappChat, WhatsappMessage } from '../types.ts';
import {
  mockStages,
  mockClients,
  mockServices,
  mockAppointments,
  mockTransactions,
  mockTasks,
  mockNotes,
  mockBudgets,
  mockUserProfile,
  mockPrescriptionTemplate,
  mockWhatsappChats,
  mockWhatsappMessages,
} from '../utils/mockData.ts';

/**
 * Helper to simulate async database calls with a short delay.
 * Also deep-copies the mock data to prevent mutations from affecting subsequent calls.
 */
const mockAsync = <T>(data: T, delay = 50): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

// --- Getters ---
export const getStages = async (): Promise<Stage[]> => mockAsync(mockStages);
export const getClients = async (): Promise<Client[]> => mockAsync(mockClients);
export const getServices = async (): Promise<Service[]> => mockAsync(mockServices);
export const getAppointments = async (): Promise<Appointment[]> => {
    const appointmentsWithClientNames = mockAppointments.map(a => ({
        ...a,
        clientName: mockClients.find(c => c.id === a.client_id)?.name || 'Cliente desconhecido'
    }));
    return mockAsync(appointmentsWithClientNames);
};
export const getTransactions = async (): Promise<Transaction[]> => mockAsync(mockTransactions);
export const getTasks = async (): Promise<Task[]> => mockAsync(mockTasks);
export const getNotes = async (): Promise<Note[]> => mockAsync(mockNotes);
export const getBudgets = async (): Promise<Budget[]> => mockAsync(mockBudgets);
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => mockAsync(mockUserProfile);
export const getAllUsers = async (): Promise<UserProfile[]> => mockAsync([mockUserProfile, { ...mockUserProfile, id: 'user-2', name: 'Outro Usuário', email: 'outro@email.com', subscription_status: 'expired' }]);

// --- Mutations (Simulated) ---
// These functions will only log the action and return a mocked successful response.
// They do not persist any changes.

export const createProfileForUser = async (user: { id: string; email?: string, user_metadata?: any }): Promise<UserProfile> => {
    console.log("Simulating createProfileForUser:", user);
    return mockAsync(mockUserProfile);
}
export const seedInitialData = async (userId: string) => {
    console.log("Simulating seedInitialData for user:", userId);
    return Promise.resolve();
};

// Stages
export const addStage = async (title: string): Promise<Stage> => mockAsync({ id: `new-stage-${Date.now()}`, user_id: 'mock-user-id-123', title, order: 99, color: 'gray' });
export const updateStage = async (id: string, updates: Partial<Omit<Stage, 'id'>>): Promise<Stage> => mockAsync({ ...mockStages[0], ...updates, id });
export const deleteStage = async (id: string): Promise<void> => { console.log("Simulating deleteStage:", id); return Promise.resolve(); };

// Clients
export const addClient = async (clientData: Omit<Client, 'id'|'user_id'|'stage_id'|'created_at'|'order'>, stageId: string): Promise<Client> => mockAsync({ ...clientData, id: `new-client-${Date.now()}`, user_id: 'mock-user-id-123', stage_id: stageId, created_at: new Date().toISOString(), order: 99 });
export const updateClient = async (clientData: Client): Promise<Client> => mockAsync(clientData);
export const updateClientStage = async (clientId: string, newStageId: string): Promise<Client> => mockAsync({ ...mockClients.find(c=>c.id === clientId)!, stage_id: newStageId });
export const updateClientsOrder = async (reorderedClients: Client[]): Promise<void> => { console.log("Simulating updateClientsOrder"); return Promise.resolve(); };

// Tasks
export const addTask = async (taskData: Omit<Task, 'id'|'completed'|'user_id'|'created_at'>): Promise<Task> => mockAsync({ ...taskData, id: `new-task-${Date.now()}`, user_id: 'mock-user-id-123', completed: false, created_at: new Date().toISOString() });
export const updateTask = async (taskData: Task): Promise<Task> => mockAsync(taskData);
export const toggleTask = async (id: string): Promise<Task> => {
    const task = mockTasks.find(t => t.id === id);
    return mockAsync({ ...task!, completed: !task!.completed });
};
export const deleteTask = async (id: string): Promise<void> => { console.log("Simulating deleteTask:", id); return Promise.resolve(); };
export const addClientTask = (clientId: string, title: string) => addTask({ title, client_id: clientId });
export const toggleClientTask = (taskId: string) => toggleTask(taskId);
export const deleteClientTask = (taskId: string) => deleteTask(taskId);

// Services
export const addService = async (serviceData: Omit<Service, 'id'|'user_id'>): Promise<Service> => mockAsync({ ...serviceData, id: `new-service-${Date.now()}`, user_id: 'mock-user-id-123'});
export const updateService = async (serviceData: Service): Promise<Service> => mockAsync(serviceData);
export const deleteService = async (id: string): Promise<void> => { console.log("Simulating deleteService:", id); return Promise.resolve(); };

// Appointments
export const addAppointment = async (apptData: Omit<Appointment, 'id' | 'clientName' | 'reminder_sent'>): Promise<Appointment> => mockAsync({ ...apptData, id: `new-appt-${Date.now()}`, clientName: mockClients.find(c => c.id === apptData.client_id)?.name || 'Cliente', reminder_sent: false });
export const updateAppointment = async (apptData: Appointment): Promise<Appointment> => mockAsync({ ...apptData, clientName: mockClients.find(c => c.id === apptData.client_id)?.name || 'Cliente' });
export const deleteAppointment = async (id: string): Promise<void> => { console.log("Simulating deleteAppointment:", id); return Promise.resolve(); };

// Transactions
export const addTransaction = async (transData: Omit<Transaction, 'id'|'user_id'|'created_at'>): Promise<Transaction> => mockAsync({ ...transData, id: `new-trans-${Date.now()}`, user_id: 'mock-user-id-123', created_at: new Date().toISOString() });
export const updateTransaction = async (transData: Transaction): Promise<Transaction> => mockAsync(transData);
export const deleteTransaction = async (id: string): Promise<void> => { console.log("Simulating deleteTransaction:", id); return Promise.resolve(); };

// Notes
export const addNote = async (noteData: Omit<Note, 'id'|'user_id'>): Promise<Note> => mockAsync({ ...noteData, id: `new-note-${Date.now()}`, user_id: 'mock-user-id-123', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
export const updateNote = async (noteData: Note): Promise<Note> => mockAsync({...noteData, updated_at: new Date().toISOString()});
export const deleteNote = async (id: string): Promise<void> => { console.log("Simulating deleteNote:", id); return Promise.resolve(); };

// Profile & Templates
export const updateUserProfile = async (profileData: UserProfile): Promise<UserProfile> => mockAsync(profileData);
export const updateBudgetTemplate = async (templateData: BudgetTemplateData): Promise<UserProfile> => mockAsync({ ...mockUserProfile, budget_template: templateData });
export const updatePrescriptionTemplate = async (templateData: PrescriptionTemplate['template_data']): Promise<any> => mockAsync(templateData);
export const saveBudget = async (budgetData: Omit<Budget, 'id'|'user_id'|'created_at'|'updated_at'> & {id?: string}): Promise<Budget> => mockAsync({ ...budgetData, id: budgetData.id?.startsWith('new-') ? `budget-${Date.now()}`: budgetData.id!, user_id: 'mock-user-id-123', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });


// --- WhatsApp/Omnichannel (MOCK) ---
export const getWhatsappChats = async (): Promise<WhatsappChat[]> => mockAsync(mockWhatsappChats);
export const getWhatsappMessages = async (chatId: string): Promise<WhatsappMessage[]> => mockAsync(mockWhatsappMessages[chatId] || []);
export const sendWhatsappMessage = async (chatId: string, content: string): Promise<any> => { console.log(`Simulating send a message to ${chatId}: ${content}`); return Promise.resolve(); };
export const clearUnreadMessages = async (chatId: string): Promise<void> => { console.log(`Simulating clear unread for ${chatId}`); return Promise.resolve(); };
export const simulateIncomingMessage = async (chatId: string, userMessage: string): Promise<void> => { console.log(`Simulating incoming message for ${chatId}`); return Promise.resolve(); };
