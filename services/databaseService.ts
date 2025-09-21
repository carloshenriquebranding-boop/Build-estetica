

/**
 * databaseService.ts
 * 
 * This service abstracts all data operations. Currently, it simulates an async database
 * by operating on in-memory mock data. When connecting to a real backend like Supabase,
 * only the functions in this file need to be changed.
 */
import {
  MOCK_STAGES, MOCK_CLIENTS, MOCK_CLIENT_TASKS, MOCK_SERVICES, MOCK_NOTES,
  MOCK_APPOINTMENTS, MOCK_TRANSACTIONS, MOCK_TASKS, MOCK_USER_PROFILE, MOCK_PRESCRIPTION_TEMPLATE
} from '../utils/mockData.ts';
import type { Stage, Client, ClientTask, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData } from '../types.ts';
import { STAGE_COLORS } from '../utils/colors.ts';

// Simulate a database with in-memory arrays from mock data
let stages: Stage[] = [...MOCK_STAGES];
let clients: Client[] = [...MOCK_CLIENTS];
let clientTasks: ClientTask[] = [...MOCK_CLIENT_TASKS];
let services: Service[] = [...MOCK_SERVICES];
let notes: Note[] = [...MOCK_NOTES];
let appointments: Appointment[] = [...MOCK_APPOINTMENTS];
let transactions: Transaction[] = [...MOCK_TRANSACTIONS];
let tasks: Task[] = [...MOCK_TASKS];
let userProfile: UserProfile = JSON.parse(JSON.stringify(MOCK_USER_PROFILE));
let prescriptionTemplate: PrescriptionTemplate = JSON.parse(JSON.stringify(MOCK_PRESCRIPTION_TEMPLATE));

const simulateDelay = (ms = 50) => new Promise(res => setTimeout(res, ms));

// --- Getters for initial data load ---
export const getStages = async (): Promise<Stage[]> => { await simulateDelay(); return [...stages].sort((a,b) => a.order - b.order); };
export const getClients = async (): Promise<Client[]> => { await simulateDelay(); return [...clients]; };
export const getClientTasks = async (): Promise<ClientTask[]> => { await simulateDelay(); return [...clientTasks]; };
export const getServices = async (): Promise<Service[]> => { await simulateDelay(); return [...services]; };
export const getNotes = async (): Promise<Note[]> => { await simulateDelay(); return [...notes]; };
export const getAppointments = async (): Promise<Appointment[]> => { await simulateDelay(); return [...appointments]; };
export const getTransactions = async (): Promise<Transaction[]> => { await simulateDelay(); return [...transactions]; };
export const getTasks = async (): Promise<Task[]> => { await simulateDelay(); return [...tasks]; };
export const getUserProfile = async (): Promise<UserProfile> => { await simulateDelay(); return {...userProfile}; };
export const getPrescriptionTemplate = async (): Promise<PrescriptionTemplate> => { await simulateDelay(); return {...prescriptionTemplate}; };

// --- Mutations ---

// Stages
export const addStage = async (title: string): Promise<Stage> => {
    await simulateDelay();
    const nextOrder = stages.length > 0 ? Math.max(...stages.map(s => s.order)) + 1 : 0;
    const nextColorIndex = stages.length % STAGE_COLORS.length;
    const newStage: Stage = { id: `stage-${Date.now()}`, title, order: nextOrder, color: STAGE_COLORS[nextColorIndex].name };
    stages.push(newStage);
    return newStage;
};
export const updateStage = async (id: string, updates: Partial<Omit<Stage, 'id'>>): Promise<Stage> => {
    await simulateDelay();
    let stageToUpdate = stages.find(s => s.id === id);
    if (!stageToUpdate) throw new Error("Stage not found");
    Object.assign(stageToUpdate, updates);
    return { ...stageToUpdate };
};
export const deleteStage = async (id: string): Promise<void> => {
    await simulateDelay();
    stages = stages.filter(s => s.id !== id);
};

// Clients
// Fix: Corrected the type for the 'data' parameter to Omit 'stage_id', as this ID is passed as a separate argument, resolving a type error.
export const addClient = async (data: Omit<Client, 'id' | 'user_id' | 'stage_id'>, stageId?: string): Promise<Client> => {
    await simulateDelay();
    const newClient: Client = { ...data, id: `client-${Date.now()}`, stage_id: stageId || stages[0].id };
    clients.push(newClient);
    return newClient;
};
export const updateClient = async (data: Client): Promise<Client> => {
    await simulateDelay();
    clients = clients.map(c => c.id === data.id ? data : c);
    return data;
};
export const updateClientStage = async (clientId: string, newStageId: string): Promise<Client> => {
    await simulateDelay();
    const client = clients.find(c => c.id === clientId);
    if (!client) throw new Error("Client not found");
    client.stage_id = newStageId;
    return { ...client };
};

// Client Tasks
export const addClientTask = async (clientId: string, title: string): Promise<ClientTask> => {
    await simulateDelay();
    const newTask: ClientTask = { id: `ctask-${Date.now()}`, client_id: clientId, title, completed: false };
    clientTasks.push(newTask);
    return newTask;
};
export const toggleClientTask = async (taskId: string): Promise<ClientTask> => {
    await simulateDelay();
    const task = clientTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Client task not found");
    task.completed = !task.completed;
    return { ...task };
};
export const deleteClientTask = async (taskId: string): Promise<void> => {
    await simulateDelay();
    clientTasks = clientTasks.filter(t => t.id !== taskId);
};

// Services
export const addService = async (data: Omit<Service, 'id'>): Promise<Service> => {
    await simulateDelay();
    const newService: Service = { ...data, id: `serv-${Date.now()}`};
    services.push(newService);
    return newService;
};
export const updateService = async (data: Service): Promise<Service> => {
    await simulateDelay();
    services = services.map(s => s.id === data.id ? data : s);
    return data;
};
export const deleteService = async (id: string): Promise<void> => {
    await simulateDelay();
    services = services.filter(s => s.id !== id);
};

// Appointments
export const addAppointment = async (data: Omit<Appointment, 'id'|'clientName'|'reminder_sent'>): Promise<Appointment> => {
    await simulateDelay();
    const clientName = clients.find(c => c.id === data.client_id)?.name || 'Unknown';
    const newAppt: Appointment = { ...data, id: `appt-${Date.now()}`, clientName, reminder_sent: false };
    appointments.push(newAppt);
    return newAppt;
};
export const updateAppointment = async (data: Appointment): Promise<Appointment> => {
    await simulateDelay();
    const clientName = clients.find(c => c.id === data.client_id)?.name || 'Unknown';
    // When updating, if a reminder is set, reset the reminder_sent flag. A real backend would handle this logic.
    const reminderSentStatus = data.reminder_minutes_before ? false : data.reminder_sent;
    const updatedData = {...data, clientName, reminder_sent: reminderSentStatus };
    appointments = appointments.map(a => a.id === data.id ? updatedData : a);
    return updatedData;
};
export const deleteAppointment = async (id: string): Promise<void> => {
    await simulateDelay();
    appointments = appointments.filter(a => a.id !== id);
};

// Transactions
export const addTransaction = async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await simulateDelay();
    const newTransaction: Transaction = { ...data, id: `trans-${Date.now()}` };
    transactions.push(newTransaction);
    return newTransaction;
};
export const updateTransaction = async (data: Transaction): Promise<Transaction> => {
    await simulateDelay();
    transactions = transactions.map(t => t.id === data.id ? data : t);
    return data;
};
export const deleteTransaction = async (id: string): Promise<void> => {
    await simulateDelay();
    transactions = transactions.filter(t => t.id !== id);
};

// Global Tasks
export const addTask = async (data: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
    await simulateDelay();
    const newTask: Task = { ...data, id: `task-${Date.now()}`, completed: false };
    tasks.push(newTask);
    return newTask;
};
export const updateTask = async (data: Task): Promise<Task> => {
    await simulateDelay();
    tasks = tasks.map(t => t.id === data.id ? data : t);
    return data;
};
export const toggleTask = async (id: string): Promise<Task> => {
    await simulateDelay();
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error("Task not found");
    task.completed = !task.completed;
    return { ...task };
};
export const deleteTask = async (id: string): Promise<void> => {
    await simulateDelay();
    tasks = tasks.filter(t => t.id !== id);
};

// Notes
export const addNote = async (data: Omit<Note, 'id'>): Promise<Note> => {
    await simulateDelay();
    const newNote: Note = { ...data, id: `note-${Date.now()}` };
    notes.push(newNote);
    return newNote;
};
export const updateNote = async (data: Note): Promise<Note> => {
    await simulateDelay();
    notes = notes.map(n => n.id === data.id ? data : n);
    return data;
};
export const deleteNote = async (id: string): Promise<void> => {
    await simulateDelay();
    notes = notes.filter(n => n.id !== id);
};

// User Profile & Templates
export const updateUserProfile = async (data: UserProfile): Promise<UserProfile> => {
    await simulateDelay();
    userProfile = data;
    return { ...userProfile };
};
export const updateBudgetTemplate = async (data: BudgetTemplateData): Promise<UserProfile> => {
    await simulateDelay();
    userProfile.budget_template = data;
    return { ...userProfile };
};
export const updatePrescriptionTemplate = async (data: PrescriptionTemplate['template_data']): Promise<PrescriptionTemplate> => {
    await simulateDelay();
    prescriptionTemplate.template_data = data;
    return { ...prescriptionTemplate };
};