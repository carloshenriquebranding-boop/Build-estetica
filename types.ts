// types.ts

export interface Stage {
  id: string;
  user_id: string;
  title: string;
  order: number;
  color: string;
}

export interface Client {
  id: string;
  user_id: string;
  stage_id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  description?: string;
  created_at: string;
  // Fix: Made treatment optional as it's not a required DB field and is not always provided.
  treatment?: string;
}

export interface ClientTask {
  id: string;
  client_id: string;
  title: string;
  completed: boolean;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Note {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  content: string; // JSON from Tiptap editor
  type: 'standard' | 'prescription';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  clientName: string; // denormalized for convenience
  treatment: string; // from treatment_name column
  date: Date; // Keep as Date object for calendar components
  notes?: string;
  reminder_minutes_before: number | null;
  reminder_sent: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  client_id: string | null;
  service_id: string | null;
  type: 'income' | 'expense';
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  description: string;
  date: Date; // Keep as Date object for components
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  client_id?: string | null;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string | null; // Stored as 'YYYY-MM-DD'
  created_at: string;
}

export interface BudgetTemplateData {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    fontFamily: string;
    logoUrl: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  business_name: string;
  business_phone?: string;
  business_address?: string;
  business_email?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  subscription_status: 'active' | 'pending_payment' | 'expired' | 'canceled';
  subscription_expires_at: string | null;
  budget_template?: BudgetTemplateData;
  prescription_template?: any;
}

export interface PrescriptionTemplate {
    id: string;
    user_id: string;
    template_data: {
        business_name: string;
        professional_name: string;
        professional_info: string;
        address: string;
        contact_info: string;
        font_family: string;
    }
}

export interface BudgetItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
    unit_price: number;
}

export interface Budget {
  id: string;
  user_id: string;
  client_id: string;
  template_id: string;
  items: BudgetItem[];
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface WhatsappChat {
    id: string;
    user_id: string;
    contact_name: string;
    contact_phone: string;
    last_message: string | null;
    last_message_at: string;
    unread_count: number;
    created_at: string;
}

export interface WhatsappMessage {
    id: string;
    chat_id: string;
    user_id: string;
    content: string;
    is_from_me: boolean;
    created_at: string;
}
