/**
 * databaseService.ts
 * 
 * This service abstracts all data operations.
 * NOW MODIFIED TO RETURN MOCK DATA FOR DEMONSTRATION.
 */
import { supabase } from './supabaseClient.ts';
import type { Stage, Client, ClientTask, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData, WhatsappChat, WhatsappMessage } from '../types.ts';
import { getAiSuggestion } from './aiService.ts';
import * as mockData from '../utils/mockData.ts';

// Helper to get the current user ID. For mocks, it returns a static ID.
const getUserId = async (): Promise<string> => {
    return Promise.resolve('mock-user-id-123');
};

// --- Getters for initial data load (now using mock data) ---
export const getStages = async (): Promise<Stage[]> => {
    return Promise.resolve(mockData.mockStages);
};
export const getClients = async (): Promise<Client[]> => {
    return Promise.resolve(mockData.mockClients);
};
export const getClientTasks = async (): Promise<ClientTask[]> => {
    return Promise.resolve(mockData.mockClientTasks);
};
export const getServices = async (): Promise<Service[]> => {
    return Promise.resolve(mockData.mockServices);
};
export const getNotes = async (): Promise<Note[]> => {
    return Promise.resolve(mockData.mockNotes);
};
export const getAppointments = async (): Promise<Appointment[]> => {
    return Promise.resolve(mockData.mockAppointments.map(a => ({ ...a, date: new Date(a.date) })));
};
export const getTransactions = async (): Promise<Transaction[]> => {
    return Promise.resolve(mockData.mockTransactions.map(t => ({...t, date: new Date(t.date)})));
};
export const getTasks = async (): Promise<Task[]> => {
    return Promise.resolve(mockData.mockTasks);
};
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    return Promise.resolve(mockData.mockUserProfile);
};
export const getPrescriptionTemplate = async (): Promise<PrescriptionTemplate | null> => {
    return Promise.resolve(mockData.mockPrescriptionTemplate);
};
export const getAllUsers = async (): Promise<UserProfile[]> => {
    return Promise.resolve([
        mockData.mockUserProfile, 
        { ...mockData.mockUserProfile, id: 'another-user', name: 'John Doe', email: 'john@doe.com', is_active: false, subscription_status: 'expired', subscription_expires_at: new Date().toISOString() }
    ]);
};

// --- Mocked Mutations ---
export const createProfileForUser = async (user: { id: string; email?: string; user_metadata: { [key: string]: any } }): Promise<UserProfile> => {
    console.log("MockService: Creating profile for", user.email);
    return Promise.resolve(mockData.mockUserProfile);
};

// Stages
export const addStage = async (title: string): Promise<Stage> => {
    const newStage = { id: `stage-${Date.now()}`, title, order: mockData.mockStages.length, color: 'blue' };
    mockData.mockStages.push(newStage);
    return Promise.resolve(newStage);
};
export const updateStage = async (id: string, updates: Partial<Omit<Stage, 'id'>>): Promise<Stage> => {
    const existing = mockData.mockStages.find(s => s.id === id)!;
    const updated = { ...existing, ...updates };
    return Promise.resolve(updated);
};
export const deleteStage = async (id: string): Promise<void> => {
    return Promise.resolve();
};

// Clients
export const addClient = async (clientData: Omit<Client, 'id' | 'user_id' | 'stage_id'>, stageId: string): Promise<Client> => {
    const newClient: Client = { ...clientData, id: `client-${Date.now()}`, stage_id: stageId, user_id: 'mock-user-id-123' };
    return Promise.resolve(newClient);
};
export const updateClient = async (clientData: Client): Promise<Client> => {
    return Promise.resolve(clientData);
};
export const updateClientStage = async (clientId: string, newStageId: string): Promise<Client> => {
    const client = mockData.mockClients.find(c => c.id === clientId)!;
    return Promise.resolve({ ...client, stage_id: newStageId });
};

// Client Tasks
export const addClientTask = async (clientId: string, title: string): Promise<ClientTask> => {
    const newTask: ClientTask = { id: `ctask-${Date.now()}`, client_id: clientId, title, completed: false };
    return Promise.resolve(newTask);
};
export const toggleClientTask = async (taskId: string): Promise<ClientTask> => {
    const task = mockData.mockClientTasks.find(t => t.id === taskId)!;
    return Promise.resolve({ ...task, completed: !task.completed });
};
export const deleteClientTask = async (taskId: string): Promise<void> => {
    return Promise.resolve();
};

// Services
export const addService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    const newService: Service = { ...serviceData, id: `service-${Date.now()}` };
    return Promise.resolve(newService);
};
export const updateService = async (serviceData: Service): Promise<Service> => {
    return Promise.resolve(serviceData);
};
export const deleteService = async (id: string): Promise<void> => {
    return Promise.resolve();
};

// Appointments
export const addAppointment = async (apptData: Omit<Appointment, 'id'|'clientName'|'reminder_sent'>): Promise<Appointment> => {
    const client = mockData.mockClients.find(c => c.id === apptData.client_id);
    const newAppt: Appointment = { ...apptData, id: `appt-${Date.now()}`, clientName: client?.name || 'Unknown', reminder_sent: false };
    return Promise.resolve(newAppt);
};
export const updateAppointment = async (apptData: Appointment): Promise<Appointment> => {
     const client = mockData.mockClients.find(c => c.id === apptData.client_id);
    return Promise.resolve({...apptData, clientName: client?.name || 'Unknown'});
};
export const deleteAppointment = async (id: string): Promise<void> => {
    return Promise.resolve();
};

// Transactions
export const addTransaction = async (transData: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const newTrans: Transaction = { ...transData, id: `trans-${Date.now()}` };
    return Promise.resolve(newTrans);
};
export const updateTransaction = async (transData: Transaction): Promise<Transaction> => {
    return Promise.resolve(transData);
};
export const deleteTransaction = async (id: string): Promise<void> => {
    return Promise.resolve();
};

// Global Tasks
export const addTask = async (taskData: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
    const newTask: Task = { ...taskData, id: `task-${Date.now()}`, completed: false };
    return Promise.resolve(newTask);
};
export const updateTask = async (taskData: Task): Promise<Task> => {
    return Promise.resolve(taskData);
};
export const toggleTask = async (id: string): Promise<Task> => {
    const task = mockData.mockTasks.find(t => t.id === id)!;
    return Promise.resolve({ ...task, completed: !task.completed });
};
export const deleteTask = async (id: string): Promise<void> => {
    return Promise.resolve();
};

// Notes
export const addNote = async (noteData: Omit<Note, 'id'>): Promise<Note> => {
    const newNote: Note = { ...noteData, id: `note-${Date.now()}` };
    return Promise.resolve(newNote);
};
export const updateNote = async (noteData: Note): Promise<Note> => {
    return Promise.resolve(noteData);
};
export const deleteNote = async (id: string): Promise<void> => {
    return Promise.resolve();
};

// User Profile & Templates
export const updateUserProfile = async (profileData: UserProfile): Promise<UserProfile> => {
    return Promise.resolve(profileData);
};
export const updateBudgetTemplate = async (templateData: BudgetTemplateData): Promise<UserProfile> => {
    const profile = { ...mockData.mockUserProfile, budget_template: templateData };
    return Promise.resolve(profile);
};
export const updatePrescriptionTemplate = async (templateData: PrescriptionTemplate['template_data']): Promise<PrescriptionTemplate> => {
    const template = { ...mockData.mockPrescriptionTemplate, template_data: templateData };
    return Promise.resolve(template);
};

// --- Omnichannel / WhatsApp Functions ---
export const getWhatsappChats = async (): Promise<WhatsappChat[]> => {
    return Promise.resolve(mockData.mockWhatsappChats);
};
export const getWhatsappMessages = async (chatId: string): Promise<WhatsappMessage[]> => {
    return Promise.resolve(mockData.mockWhatsappMessages.filter(m => m.chat_id === chatId));
};
export const sendWhatsappMessage = async (chatId: string, content: string): Promise<WhatsappMessage> => {
    const newMessage: WhatsappMessage = {
        id: `msg-${Date.now()}`,
        chat_id: chatId,
        user_id: 'mock-user-id-123',
        content,
        is_from_me: true,
        created_at: new Date().toISOString(),
    };
    return Promise.resolve(newMessage);
};
export const clearUnreadMessages = async (chatId: string): Promise<void> => {
    return Promise.resolve();
};
export const simulateIncomingMessage = async (chatId: string, userMessage: string): Promise<void> => {
    console.log(`Simulating reply to: "${userMessage}" in chat ${chatId}`);
    // This function will be called but won't add a new message to the static mock data.
    // The AI response logic in the component can be tested independently.
};