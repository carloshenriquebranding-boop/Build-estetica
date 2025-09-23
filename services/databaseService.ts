// services/databaseService.ts
import { supabase } from './supabaseClient.ts';
import type { Stage, Client, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData, Budget } from '../types.ts';
import { mockStages, mockClients, mockServices, mockAppointments, mockTransactions, mockTasks, mockNotes, mockBudgets } from '../utils/mockData.ts';


// Helper para obter o usuário logado ou lançar um erro
const getUserIdOrThrow = async (): Promise<string> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error("User not authenticated.");
    }
    return user.id;
};

// --- Seed Initial Data for New Users ---
export const seedInitialData = async (userId: string) => {
    try {
        // Map all mock data to the new user's ID
        const stagesToInsert = mockStages.map(s => ({ ...s, id: undefined, user_id: userId }));
        const servicesToInsert = mockServices.map(s => ({ ...s, id: undefined, user_id: userId }));
        
        // Insert stages and services first to get their new IDs
        const { data: newStages, error: stagesError } = await supabase.from('stages').insert(stagesToInsert).select();
        if (stagesError) throw stagesError;
        
        const { data: newServices, error: servicesError } = await supabase.from('services').insert(servicesToInsert).select();
        if (servicesError) throw servicesError;

        // Create mapping from old mock IDs to new database IDs
        const stageIdMap = mockStages.reduce((acc, stage, index) => {
            acc[stage.id] = newStages[index].id;
            return acc;
        }, {} as Record<string, string>);

        const serviceIdMap = mockServices.reduce((acc, service, index) => {
            acc[service.id] = newServices[index].id;
            return acc;
        }, {} as Record<string, string>);

        // Now map clients with the new stage IDs
        const clientsToInsert = mockClients.map(c => ({ 
            ...c, 
            id: undefined, 
            user_id: userId, 
            stage_id: stageIdMap[c.stage_id] 
        }));
        const { data: newClients, error: clientsError } = await supabase.from('clients').insert(clientsToInsert).select();
        if (clientsError) throw clientsError;

        const clientIdMap = mockClients.reduce((acc, client, index) => {
            acc[client.id] = newClients[index].id;
            return acc;
        }, {} as Record<string, string>);

        // Map remaining data with new foreign keys
        const appointmentsToInsert = mockAppointments.map(a => ({
            id: undefined,
            user_id: userId,
            client_id: clientIdMap[a.client_id],
            treatment_name: a.treatment,
            date: a.date.toISOString(),
            notes: a.notes,
            reminder_minutes_before: a.reminder_minutes_before,
        }));

        const transactionsToInsert = mockTransactions.map(t => ({
            ...t,
            id: undefined,
            user_id: userId,
            client_id: t.client_id ? clientIdMap[t.client_id] : null,
            service_id: t.service_id ? serviceIdMap[t.service_id] : null,
        }));
        
        const tasksToInsert = mockTasks.map(t => ({
            ...t,
            id: undefined,
            user_id: userId,
            client_id: t.client_id ? clientIdMap[t.client_id] : null,
        }));
        
        const notesToInsert = mockNotes.map(n => ({
            ...n,
            id: undefined,
            user_id: userId,
            client_id: n.client_id ? clientIdMap[n.client_id] : null,
        }));

        const budgetsToInsert = mockBudgets.map(b => ({
            ...b,
            id: undefined,
            user_id: userId,
            client_id: clientIdMap[b.client_id],
        }));

        // Perform batch inserts
        await Promise.all([
            supabase.from('appointments').insert(appointmentsToInsert),
            supabase.from('transactions').insert(transactionsToInsert),
            supabase.from('tasks').insert(tasksToInsert),
            supabase.from('notes').insert(notesToInsert),
            supabase.from('budgets').insert(budgetsToInsert)
        ]);
        
        console.log("Successfully seeded initial data for new user.");

    } catch (error) {
        console.error("Error seeding initial data:", error);
        // Don't re-throw, as we don't want to block the user from logging in.
        // The app will just be empty, which is better than a crash.
    }
};


// --- Getters ---
export const getStages = async (): Promise<Stage[]> => {
    const { data, error } = await supabase.from('stages').select('*').order('order');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};

export const getClients = async (): Promise<Client[]> => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};

export const getServices = async (): Promise<Service[]> => {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};

export const getAppointments = async (): Promise<Appointment[]> => {
    const { data, error } = await supabase.from('appointments').select('*, clients(name)');
    if (error) throw error;
    
    // Mapeia os dados para o formato esperado pelo frontend
    // Fix: The data from Supabase can be null. Defaulting to an empty array `[]` before calling `.map` prevents a runtime error if no records are found.
    // Fix: Correctly map fields to match the Appointment type definition (e.g., client_id, not clientId).
    const appointments = (data || []).map(appt => ({
        id: appt.id,
        client_id: appt.client_id,
        clientName: (appt.clients as { name: string })?.name || 'Cliente Removido',
        treatment: appt.treatment_name,
        date: new Date(appt.date),
        notes: appt.notes,
        reminder_minutes_before: appt.reminder_minutes_before,
        reminder_sent: appt.reminder_sent,
    }));
    return appointments as Appointment[];
};

export const getTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) throw error;
    // Converte datas string para objetos Date
    // Fix: Handle null data from supabase before mapping and remove incorrect snakeToCamel conversion. This resolves the reported error.
    return (data || []).map((t: any) => ({...t, date: new Date(t.date)}));
};

export const getTasks = async (): Promise<Task[]> => {
    // A tabela 'tasks' agora unifica ClientTask e Task
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};

// Deprecated, tasks são unificadas. Mantenha para compatibilidade ou remova.
export const getClientTasks = async (): Promise<any[]> => {
    return []; 
};

export const getNotes = async (): Promise<Note[]> => {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};

export const getBudgets = async (): Promise<Budget[]> => {
    const { data, error } = await supabase.from('budgets').select('*');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    // The `.single()` method throws an error (code PGRST116) if no row is found.
    // For a new user, this is expected behavior, not an application-level error.
    // We catch this specific case and return null, allowing the app to proceed with profile creation.
    if (error && error.code === 'PGRST116') {
        return null;
    }

    if (error) {
        // For any other database errors, we log them and re-throw to be handled by the caller.
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
    return data;
};

export const getPrescriptionTemplate = async (): Promise<PrescriptionTemplate | null> => {
    // Prescrições são um tipo de anotação, o "template" agora é parte do perfil do usuário.
    // Esta função pode ser adaptada ou removida dependendo da lógica final.
    return null; // A lógica foi movida para o perfil do usuário
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    // Fix: Handle null data from supabase and remove incorrect snakeToCamel conversion
    return data || [];
};


// --- Mutations ---

export const createProfileForUser = async (user: { id: string; email?: string }): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        name: 'Novo Usuário',
        business_name: 'Minha Clínica'
      })
      .select()
      .single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

// Stages
export const addStage = async (title: string): Promise<Stage> => {
    const userId = await getUserIdOrThrow();
    const { data: countData, error: countError, count } = await supabase.from('stages').select('*', { count: 'exact', head: true });
    if(countError) throw countError;

    const { data, error } = await supabase.from('stages').insert({ title, user_id: userId, order: count || 0 }).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updateStage = async (id: string, updates: Partial<Omit<Stage, 'id'>>): Promise<Stage> => {
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('stages').update(updates).eq('id', id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const deleteStage = async (id: string): Promise<void> => {
    const { error } = await supabase.from('stages').delete().eq('id', id);
    if (error) throw error;
};

// Clients
// Fix: Updated signature to omit `created_at` as it's handled by the database.
export const addClient = async (clientData: Omit<Client, 'id' | 'user_id' | 'stage_id' | 'created_at'>, stageId: string): Promise<Client> => {
    const userId = await getUserIdOrThrow();
    const newClient = { ...clientData, stage_id: stageId, user_id: userId };
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('clients').insert(newClient).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updateClient = async (clientData: Client): Promise<Client> => {
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('clients').update(clientData).eq('id', clientData.id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updateClientStage = async (clientId: string, newStageId: string): Promise<Client> => {
    const { data, error } = await supabase.from('clients').update({ stage_id: newStageId }).eq('id', clientId).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

// Tasks (unificados)
// Fix: Updated signature to omit fields handled by the database (`user_id`, `created_at`).
export const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'user_id' | 'created_at'>): Promise<Task> => {
    const userId = await getUserIdOrThrow();
    const newTask = { ...taskData, user_id: userId, completed: false };
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updateTask = async (taskData: Task): Promise<Task> => {
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('tasks').update(taskData).eq('id', taskData.id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const toggleTask = async (id: string): Promise<Task> => {
    const { data: current, error: fetchError } = await supabase.from('tasks').select('completed').eq('id', id).single();
    if (fetchError) throw fetchError;
    const { data, error } = await supabase.from('tasks').update({ completed: !current.completed }).eq('id', id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
};

// Deprecated ClientTask handlers - now map to unified tasks
export const addClientTask = async (clientId: string, title: string): Promise<Task> => addTask({ title, client_id: clientId });
export const toggleClientTask = async (taskId: string): Promise<Task> => toggleTask(taskId);
export const deleteClientTask = async (taskId: string): Promise<void> => deleteTask(taskId);


// Services
export const addService = async (serviceData: Omit<Service, 'id' | 'user_id'>): Promise<Service> => {
    const userId = await getUserIdOrThrow();
    const newService = { ...serviceData, user_id: userId };
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('services').insert(newService).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updateService = async (serviceData: Service): Promise<Service> => {
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('services').update(serviceData).eq('id', serviceData.id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const deleteService = async (id: string): Promise<void> => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
};

// Appointments
export const addAppointment = async (apptData: Omit<Appointment, 'id' | 'clientName' | 'reminder_sent'>): Promise<Appointment> => {
    const userId = await getUserIdOrThrow();
    const newAppt = {
        user_id: userId,
        client_id: apptData.client_id,
        treatment_name: apptData.treatment,
        date: apptData.date.toISOString(),
        notes: apptData.notes,
        reminder_minutes_before: apptData.reminder_minutes_before,
    };
    const { data, error } = await supabase.from('appointments').insert(newAppt).select('*, clients(name)').single();
    if (error) throw error;
    // Fix: Manually construct object to match Appointment type without incorrect snakeToCamel conversion.
    const result = data as any;
    return {
        id: result.id,
        client_id: result.client_id,
        clientName: result.clients?.name || 'N/A',
        treatment: result.treatment_name,
        date: new Date(result.date),
        notes: result.notes,
        reminder_minutes_before: result.reminder_minutes_before,
        reminder_sent: result.reminder_sent,
    } as Appointment;
};

export const updateAppointment = async (apptData: Appointment): Promise<Appointment> => {
    const updates = {
        client_id: apptData.client_id,
        treatment_name: apptData.treatment,
        date: apptData.date.toISOString(),
        notes: apptData.notes,
        reminder_minutes_before: apptData.reminder_minutes_before,
    };
    const { data, error } = await supabase.from('appointments').update(updates).eq('id', apptData.id).select('*, clients(name)').single();
    if (error) throw error;
    // Fix: Manually construct object to match Appointment type without incorrect snakeToCamel conversion.
    const result = data as any;
    return {
        id: result.id,
        client_id: result.client_id,
        clientName: result.clients?.name || 'N/A',
        treatment: result.treatment_name,
        date: new Date(result.date),
        notes: result.notes,
        reminder_minutes_before: result.reminder_minutes_before,
        reminder_sent: result.reminder_sent,
    } as Appointment;
};

export const deleteAppointment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
};


// Transactions
// Fix: Updated signature to omit `user_id` and `created_at`.
export const addTransaction = async (transData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> => {
    const userId = await getUserIdOrThrow();
    const newTrans = { ...transData, user_id: userId, date: transData.date.toISOString().split('T')[0] };
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('transactions').insert(newTrans).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion and handle date type
    return {...data, date: new Date(data.date)} as Transaction;
};
export const updateTransaction = async (transData: Transaction): Promise<Transaction> => {
    const updates = { ...transData, date: transData.date.toISOString().split('T')[0] };
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('transactions').update(updates).eq('id', transData.id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion and handle date type
    return {...data, date: new Date(data.date)} as Transaction;
};
export const deleteTransaction = async (id: string): Promise<void> => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
};


// Notes
// Fix: Updated signature to omit `user_id`.
export const addNote = async (noteData: Omit<Note, 'id' | 'user_id'>): Promise<Note> => {
    const userId = await getUserIdOrThrow();
    const newNote = { ...noteData, user_id: userId };
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('notes').insert(newNote).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};
export const updateNote = async (noteData: Note): Promise<Note> => {
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('notes').update(noteData).eq('id', noteData.id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};
export const deleteNote = async (id: string): Promise<void> => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
};


// User Profile & Templates
export const updateUserProfile = async (profileData: UserProfile): Promise<UserProfile> => {
    // Fix: remove incorrect camelToSnake conversion
    const { data, error } = await supabase.from('profiles').update(profileData).eq('id', profileData.id).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updateBudgetTemplate = async (templateData: BudgetTemplateData): Promise<UserProfile> => {
    const userId = await getUserIdOrThrow();
    const { data, error } = await supabase.from('profiles').update({ budget_template: templateData }).eq('id', userId).select().single();
    if (error) throw error;
    // Fix: remove incorrect snakeToCamel conversion
    return data;
};

export const updatePrescriptionTemplate = async (templateData: PrescriptionTemplate['template_data']): Promise<any> => {
    // This logic now updates the user's profile instead of a separate table.
    const userId = await getUserIdOrThrow();
    const { data, error } = await supabase.from('profiles').update({ prescription_template: templateData }).eq('id', userId).select().single();
    if (error) throw error;
    // Fix: Cast the result to UserProfile to access its properties safely.
    return (data as UserProfile).prescription_template;
};

export const saveBudget = async (budgetData: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Budget> => {
    const userId = await getUserIdOrThrow();
    const payload = { ...budgetData, user_id: userId };
    
    if (budgetData.id) {
        // Fix: remove incorrect camelToSnake conversion
        const { data, error } = await supabase.from('budgets').update(payload).eq('id', budgetData.id).select().single();
        if(error) throw error;
        // Fix: remove incorrect snakeToCamel conversion
        return data;
    } else {
        // Fix: Removed destructuring of `id` as it can be undefined for new records.
        // Fix: remove incorrect camelToSnake conversion
        const { data, error } = await supabase.from('budgets').insert(payload).select().single();
        if(error) throw error;
        // Fix: remove incorrect snakeToCamel conversion
        return data;
    }
};

// --- WhatsApp/Omnichannel ---
// These remain largely placeholders as they depend on a separate backend service.
// This part of the code will interact with your Coolify-hosted Baileys instance.
export const getWhatsappChats = async (): Promise<any[]> => Promise.resolve([]);
export const getWhatsappMessages = async (chatId: string): Promise<any[]> => Promise.resolve([]);
export const sendWhatsappMessage = async (chatId: string, content: string): Promise<any> => Promise.resolve({});
export const clearUnreadMessages = async (chatId: string): Promise<void> => Promise.resolve();
export const simulateIncomingMessage = async (chatId: string, userMessage: string): Promise<void> => Promise.resolve();