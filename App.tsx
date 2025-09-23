

import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Stage, Client, Service, Note, Appointment, Transaction, Task, UserProfile, PrescriptionTemplate, BudgetTemplateData, Budget, ClientTask } from './types.ts';
import * as db from './services/databaseService.ts';
import { supabase } from './services/supabaseClient.ts';
import { scheduleReminder } from './services/notificationService.ts';

import MenuView from './components/MenuView.tsx';
import MobileMenuView from './components/MobileMenuView.tsx';
import DashboardView from './components/DashboardView.tsx';
import KanbanBoard from './components/KanbanBoard.tsx';
import ClientsView from './components/ClientsView.tsx';
import CalendarView from './components/CalendarView.tsx';
import ServicesView from './components/ServicesView.tsx';
import FinancialView from './components/FinancialView.tsx';
import TasksView from './components/TasksView.tsx';
import NotesView from './components/NotesView.tsx';
import OmnichannelView from './components/OmnichannelView.tsx';
import PrescriptionView from './components/PrescriptionView.tsx';
import ProfileView from './components/ProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';
import AppointmentModal from './components/AppointmentModal.tsx';
import EditClientModal from './components/EditClientModal.tsx';
import SearchView from './components/SearchView.tsx';
import AuthView from './components/AuthView.tsx';
import AdminView from './components/AdminView.tsx';
import BlockedAccessView from './components/BlockedAccessView.tsx';
import RoleSelectionView from './components/RoleSelectionView.tsx';
import HelpModal from './components/HelpModal.tsx';
import AIAgentsView from './components/AIAgentsView.tsx';
import Chatbot from './components/Chatbot.tsx';
import { Loader2 } from './components/icons/Loader2.tsx';
import CampaignsView from './components/CampaignsView.tsx';
import BudgetView from './components/BudgetView.tsx';

type AuthState = 'unauthenticated' | 'selecting_role' | 'in_crm' | 'in_admin' | 'blocked' | 'loading';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
    }
    return 'dark'; // Default theme
};

const DEFAULT_BUDGET_TEMPLATE: BudgetTemplateData = {
  primaryColor: '#db2777', // pink-600
  secondaryColor: '#fdf2f8', // pink-50
  textColor: '#1e293b', // slate-800
  fontFamily: 'Poppins, sans-serif',
  logoUrl: null,
};


const App: React.FC = () => {
  const [authState, setAuthState] = React.useState<AuthState>('loading');
  const [activeView, setActiveView] = React.useState('dashboard');
  const [notesSearchTerm, setNotesSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);

  // App-level state
  const [stages, setStages] = React.useState<Stage[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [prescriptionTemplate, setPrescriptionTemplate] = React.useState<PrescriptionTemplate | null>(null);
  const [budgetTemplate, setBudgetTemplate] = React.useState<BudgetTemplateData | null>(null);
  
  // Modal State
  const [isAppointmentModalOpen, setAppointmentModalOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [selectedDateForModal, setSelectedDateForModal] = React.useState<Date | null>(null);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [isSearchViewOpen, setIsSearchViewOpen] = React.useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);

  // Theme side effect manager
  React.useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error("Could not save theme to localStorage:", error);
    }
  }, [theme]);
  
  // Theme change handler
  const handleThemeChange = (newTheme: Theme) => {
      setTheme(newTheme);
  };

  // Real-time Authentication Listener
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          let profile = await db.getUserProfile(session.user.id);
          
          if (!profile) {
              console.log("No profile found for user, attempting to create one.");
              profile = await db.createProfileForUser(session.user);
              // For new users, seed the database with initial mock data.
              console.log("New user detected, seeding initial mock data...");
              await db.seedInitialData(session.user.id);
              console.log("Mock data seeding complete.");
          }
          
          setUserProfile(profile);
        } catch (error) {
          // Improved error logging to provide more details than "[object Object]"
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("--- DETAILED PROFILE FETCH/CREATE ERROR ---", errorMessage);
          console.error("Full error object:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data Loading and Auth State Determination
  React.useEffect(() => {
    if (userProfile) {
      setAuthState('loading');
      setIsLoading(true);
      
      const loadAppData = async () => {
        try {
          const [
            stagesData, clientsData, servicesData, notesData,
            appointmentsData, transactionsData, tasksData, budgetsData
          ] = await Promise.all([
            db.getStages(), db.getClients(), db.getServices(), db.getNotes(),
            db.getAppointments(), db.getTransactions(), db.getTasks(), db.getBudgets()
          ]);
          setStages(stagesData);
          setClients(clientsData);
          setServices(servicesData);
          setNotes(notesData);
          setAppointments(appointmentsData);
          setTransactions(transactionsData);
          setTasks(tasksData);
          setBudgets(budgetsData);

          // Templates are part of the user profile
          setPrescriptionTemplate(userProfile.prescription_template || null);
          setBudgetTemplate(userProfile.budget_template || DEFAULT_BUDGET_TEMPLATE);
          
          if (userProfile.is_active === false) {
            setAuthState('blocked');
          } else if (userProfile.role === 'admin') {
            setAuthState('selecting_role');
          } else {
            setAuthState('in_crm');
          }
        } catch (error) {
          console.error("Failed to load app data. This might be due to RLS policies. Logging out.", error);
          alert("Erro ao carregar dados. Verifique sua conexão e as permissões do banco de dados (RLS).");
          await supabase.auth.signOut();
          setAuthState('unauthenticated');
        } finally {
            setIsLoading(false);
        }
      };
      loadAppData();
    } else {
      setAuthState('unauthenticated');
      setIsLoading(false);
    }
  }, [userProfile]);
  
  // --- Handlers ---
  const handleRoleSelect = (role: 'crm' | 'admin') => {
      if (role === 'crm') {
          setAuthState('in_crm');
          setActiveView('dashboard');
      } else {
          setAuthState('in_admin');
          setActiveView('admin_panel');
      }
  };

  const handleOpenAppointmentModal = (date: Date, appointment?: Appointment) => {
    setSelectedDateForModal(date);
    setSelectedAppointment(appointment || null);
    setAppointmentModalOpen(true);
  };
  
  const handleOpenEditClientModal = (client: Client) => {
    setEditingClient(client);
  };
  
  const handleSaveAppointment = async (appointmentData: Omit<Appointment, 'id' | 'clientName' | 'reminder_sent'> & { id?: string }) => {
    let savedAppointment: Appointment;

    if (appointmentData.id) {
        const updatedAppt = await db.updateAppointment(appointmentData as Appointment);
        setAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
        savedAppointment = updatedAppt;
    } else {
        const newAppointment = await db.addAppointment(appointmentData);
        setAppointments(prev => [...prev, newAppointment]);
        savedAppointment = newAppointment;
    }
    setAppointmentModalOpen(false);

    if (savedAppointment.reminder_minutes_before) {
        scheduleReminder(savedAppointment);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    await db.deleteAppointment(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    setAppointmentModalOpen(false);
  };

  const handleUpdateAppointmentDate = async (id: string, newDate: Date) => {
    const appointment = appointments.find(a => a.id === id);
    if(appointment) {
        const updatedAppt = await db.updateAppointment({ ...appointment, date: newDate });
        setAppointments(prev => prev.map(a => a.id === id ? updatedAppt : a));
    }
  };
  
  const handleNavigateToNotes = (searchTerm: string) => {
    setActiveView('notes');
    setNotesSearchTerm(searchTerm);
  };
  
  const handleBudgetTemplateChange = async (data: BudgetTemplateData) => {
    const updatedProfile = await db.updateBudgetTemplate(data);
    setUserProfile(updatedProfile);
    setBudgetTemplate(updatedProfile.budget_template!);
  };

  const handleSaveBudget = async (budgetData: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    const savedBudget = await db.saveBudget(budgetData);
    if (budgetData.id && !budgetData.id.startsWith('new-')) {
        setBudgets(prev => prev.map(b => b.id === savedBudget.id ? savedBudget : b));
    } else {
        setBudgets(prev => [...prev.filter(b => b.id !== budgetData.id), savedBudget]);
    }
    return savedBudget;
  };
  
  // --- Kanban Handlers ---
  const handleClientStageChange = async (clientId: string, newStageId: string) => {
    const updatedClient = await db.updateClientStage(clientId, newStageId);
    setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
  };
  
  const handleAddClient = async (clientData: Omit<Client, 'id' | 'stage_id' | 'user_id' | 'created_at'>, stageId: string): Promise<Client | undefined> => {
    const newClient = await db.addClient(clientData, stageId);
    setClients(prev => [...prev, newClient]);
    return newClient;
  };
  
  const handleUpdateClient = async (clientData: Client) => {
    const updatedClient = await db.updateClient(clientData);
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditingClient(null);
  };
  
  const handleAddStage = async (title: string) => {
    const newStage = await db.addStage(title);
    setStages(prev => [...prev, newStage]);
  };

  const handleUpdateStage = async (stageId: string, updates: Partial<Omit<Stage, 'id'>>) => {
    const updatedStage = await db.updateStage(stageId, updates);
    setStages(prev => prev.map(s => s.id === stageId ? updatedStage : s));
  };

  const handleDeleteStage = async (stageId: string) => {
    await db.deleteStage(stageId);
    setStages(prev => prev.filter(s => s.id !== stageId));
  };
  
  // --- Client Task Handlers ---
  const handleAddClientTask = async (clientId: string, title: string) => {
    const newTask = await db.addClientTask(clientId, title);
    setTasks(prev => [...prev, newTask]);
  };
  const handleToggleClientTask = async (taskId: string) => {
    const updatedTask = await db.toggleClientTask(taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  };
  const handleDeleteClientTask = async (taskId: string) => {
    await db.deleteClientTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  // --- Service Handlers ---
  const handleAddService = async (data: Omit<Service, 'id'|'user_id'>) => {
      try {
        const newService = await db.addService(data);
        setServices(prev => [...prev, newService]);
      } catch (error) {
        console.error("Error adding service:", error);
        throw error;
      }
  };
  const handleUpdateService = async (data: Service) => {
      try {
        const updatedService = await db.updateService(data);
        setServices(prev => prev.map(s => s.id === data.id ? updatedService : s));
      } catch (error) {
        console.error("Error updating service:", error);
        throw error;
      }
  };
  const handleDeleteService = async (id: string) => {
      try {
        await db.deleteService(id);
        setServices(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
      }
  };
  
  // --- Transaction Handlers ---
  const handleSaveTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'> & { id?: string }) => {
    if (data.id) {
        const updated = await db.updateTransaction(data as Transaction);
        setTransactions(prev => prev.map(t => t.id === data.id ? updated : t));
    } else {
        const newTransaction = await db.addTransaction(data);
        setTransactions(prev => [...prev, newTransaction]);
    }
  };
  const handleDeleteTransaction = async (id: string) => {
      await db.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  // --- Global Task Handlers ---
  const handleSaveTask = async (data: Omit<Task, 'id' | 'completed' | 'user_id' | 'created_at'> & { id?: string }) => {
     if (data.id) {
        const updated = await db.updateTask(data as Task);
        setTasks(prev => prev.map(t => t.id === data.id ? updated : t));
    } else {
        const newTask = await db.addTask(data);
        setTasks(prev => [...prev, newTask]);
    }
  };
  const handleToggleTask = async (id: string) => {
      const updated = await db.toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };
  const handleDeleteTask = async (id: string) => {
      await db.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
  };
  
  // --- Notes Handlers ---
  const handleSaveNote = async (data: Omit<Note, 'id' | 'user_id'> & { id?: string }) => {
      if (data.id) {
          const updated = await db.updateNote(data as Note);
          setNotes(prev => prev.map(n => n.id === data.id ? updated : n));
          return updated;
      } else {
          const newNote = await db.addNote(data);
          setNotes(prev => [...prev, newNote]);
          return newNote;
      }
  };
  const handleDeleteNote = async (id: string) => {
      await db.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
  };
  
  // --- Profile Handler ---
  const handleProfileUpdate = async (data: UserProfile) => {
      const updated = await db.updateUserProfile(data);
      setUserProfile(updated);
  }
  
  // --- Prescription Template Handler ---
  const handlePrescriptionTemplateChange = async (data: PrescriptionTemplate['template_data']) => {
      const updated = await db.updatePrescriptionTemplate(data);
      setPrescriptionTemplate(updated);
  }

  const renderView = () => {
    if (isLoading || !userProfile) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>;
    }
    
    const showBackButton = activeView !== 'dashboard';
    const handleBack = () => setActiveView('dashboard');
    
    if (authState === 'in_admin') {
        return <AdminView showBackButton={activeView !== 'admin_panel'} onBack={() => setActiveView('dashboard')} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView clients={clients} appointments={appointments} transactions={transactions} tasks={tasks} services={services} stages={stages} showBackButton={showBackButton} onBack={handleBack} setActiveView={setActiveView} />;
      case 'kanban':
        return <KanbanBoard stages={stages} clients={clients} clientTasks={tasks.filter(t => t.client_id) as ClientTask[]} services={services} notes={notes} onNavigateToNotes={handleNavigateToNotes} onClientStageChange={handleClientStageChange} onAddClient={handleAddClient} onOpenEditClientModal={handleOpenEditClientModal} onAddStage={handleAddStage} onUpdateStage={handleUpdateStage} onDeleteStage={handleDeleteStage} onAddClientTask={handleAddClientTask} onToggleClientTask={handleToggleClientTask} onDeleteClientTask={handleDeleteClientTask} showBackButton={showBackButton} onBack={handleBack} />;
      case 'clients':
        return <ClientsView clients={clients} stages={stages} services={services} onAddClient={(data) => handleAddClient(data, stages[0].id)} onOpenEditClientModal={handleOpenEditClientModal} showBackButton={showBackButton} onBack={handleBack} />;
      case 'calendar':
        return <CalendarView appointments={appointments} onOpenModal={handleOpenAppointmentModal} onUpdateAppointmentDate={handleUpdateAppointmentDate} showBackButton={showBackButton} onBack={handleBack} />;
      case 'services':
        return <ServicesView services={services} onAdd={handleAddService} onUpdate={handleUpdateService} onDelete={handleDeleteService} showBackButton={showBackButton} onBack={handleBack} />;
      case 'financial':
        return <FinancialView transactions={transactions} clients={clients} services={services} onSave={handleSaveTransaction} onDelete={handleDeleteTransaction} showBackButton={showBackButton} onBack={handleBack} />;
      case 'tasks':
        return <TasksView tasks={tasks} clients={clients} onSave={handleSaveTask} onToggle={handleToggleTask} onDelete={handleDeleteTask} showBackButton={showBackButton} onBack={handleBack} />;
      case 'notes':
        return <NotesView notes={notes} clients={clients} onSave={handleSaveNote} onDelete={handleDeleteNote} initialSearchTerm={notesSearchTerm} onSearchTermChange={setNotesSearchTerm} showBackButton={showBackButton} onBack={handleBack} />;
      case 'omnichannel':
          return <OmnichannelView stages={stages} services={services} onAddClient={({ stage_id, ...data }) => handleAddClient(data, stage_id)} showBackButton={showBackButton} onBack={handleBack} />;
      case 'prescription':
          const handleSavePrescriptionNote = async (noteData: Omit<Note, 'id'| 'user_id'>) => {
             await handleSaveNote(noteData);
             alert("Prescrição salva como anotação!");
          };
          return <PrescriptionView clients={clients} initialTemplate={prescriptionTemplate} userProfile={userProfile} onTemplateChange={handlePrescriptionTemplateChange} onSaveNote={handleSavePrescriptionNote} showBackButton={showBackButton} onBack={handleBack} />;
      case 'budget':
        return <BudgetView 
            clients={clients}
            services={services}
            stages={stages}
            userProfile={userProfile}
            initialTemplateData={budgetTemplate || DEFAULT_BUDGET_TEMPLATE}
            budgets={budgets}
            onTemplateSave={handleBudgetTemplateChange}
            onSaveBudget={handleSaveBudget}
            onAddClient={(data, stageId) => handleAddClient(data, stageId)}
            showBackButton={showBackButton}
            onBack={handleBack}
        />;
      case 'campaigns':
        return <CampaignsView clients={clients} stages={stages} showBackButton={showBackButton} onBack={handleBack} />;
      case 'profile':
        return <ProfileView profile={userProfile} onProfileUpdate={handleProfileUpdate} showBackButton={showBackButton} onBack={handleBack} />;
      case 'settings':
        return <SettingsView theme={theme} onThemeChange={handleThemeChange} showBackButton={showBackButton} onBack={handleBack} />;
      case 'admin_panel':
        return <AdminView showBackButton={showBackButton} onBack={handleBack} />;
      default:
        return <DashboardView clients={clients} appointments={appointments} transactions={transactions} tasks={tasks} services={services} stages={stages} showBackButton={showBackButton} onBack={handleBack} setActiveView={setActiveView} />;
    }
  };
  
  if (authState === 'loading') {
    return <div className="flex h-screen items-center justify-center bg-stone-50 dark:bg-slate-950"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>;
  }
  if (authState === 'unauthenticated') {
    return <AuthView />;
  }
  if (authState === 'blocked') {
    return <BlockedAccessView />;
  }
  if (authState === 'selecting_role') {
    return <RoleSelectionView onSelect={handleRoleSelect} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-stone-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        
        {userProfile && (
            <>
                <MenuView activeView={activeView} setActiveView={setActiveView} isAdmin={userProfile.role === 'admin'} userProfile={userProfile} onOpenSearch={() => setIsSearchViewOpen(true)} onOpenHelp={() => setIsHelpModalOpen(true)} />
            </>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8">
                {renderView()}
            </main>
        </div>
        {userProfile && (
            <MobileMenuView activeView={activeView} setActiveView={setActiveView} isAdmin={userProfile.role === 'admin'} onOpenSearch={() => setIsSearchViewOpen(true)} onOpenHelp={() => setIsHelpModalOpen(true)} />
        )}
      </div>
      
      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} onSave={handleSaveAppointment} onDelete={handleDeleteAppointment} clients={clients} services={services} notes={notes} selectedDate={selectedDateForModal} appointment={selectedAppointment} isSaving={false} isDeleting={false} onNavigateToNotes={handleNavigateToNotes} />

      {editingClient && (
         <EditClientModal
            client={editingClient}
            stages={stages}
            services={services}
            tasks={tasks.filter(t => t.client_id === editingClient.id)}
            notes={notes.filter(n => n.client_id === editingClient.id)}
            appointments={appointments.filter(a => a.client_id === editingClient.id)}
            budgets={budgets.filter(b => b.client_id === editingClient.id)}
            transactions={transactions.filter(t => t.client_id === editingClient.id)}
            onClose={() => setEditingClient(null)}
            onSave={handleUpdateClient}
            onAddTask={handleAddClientTask}
            onToggleTask={handleToggleClientTask}
            onDeleteTask={handleDeleteClientTask}
            isSubmitting={false}
            onNavigateToNotes={handleNavigateToNotes}
        />
      )}

      <SearchView isOpen={isSearchViewOpen} onClose={() => setIsSearchViewOpen(false)} clients={clients} appointments={appointments} tasks={tasks} notes={notes}
        onNavigate={(view, term) => {
            setActiveView(view);
            if (term && view === 'notes') setNotesSearchTerm(term);
            setIsSearchViewOpen(false);
        }}
        onEditClient={(client) => {
            handleOpenEditClientModal(client);
            setIsSearchViewOpen(false);
        }}
        onEditAppointment={(appointment) => {
            handleOpenAppointmentModal(appointment.date, appointment);
            setIsSearchViewOpen(false);
        }}
      />
      
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      
      <Chatbot />

    </DndProvider>
  );
};

export default App;