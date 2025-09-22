// types.ts

export interface Stage {
  id: string;
  title: string;
  order: number;
  color: string;
}

export interface Client {
  id: string;
  stage_id: string;
  user_id?: string;
  name: string;
  phone: string;
  email?: string;
  treatment: string;
  description?: string;
  notes?: string;
  address?: string; // For budget
}

export interface ClientTask {
  id: string;
  client_id: string;
  title: string;
  completed: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Note {
  id: string;
  user_id?: string | null;
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
  treatment: string;
  date: Date;
  notes?: string;
  reminder_minutes_before: number | null;
  reminder_sent: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  client_id: string | null;
  service_id: string | null;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string | null;
  client_id?: string | null;
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
  business_email?: string;
  avatar_url?: string;
  business_name: string;
  business_phone?: string;
  business_address?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  subscription_status: 'active' | 'pending_payment' | 'expired' | 'canceled';
  subscription_expires_at: string | null;
  budget_template?: BudgetTemplateData;
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


// Omnichannel types
export interface WhatsappChat {
    id: string; // uuid
    user_id: string; // uuid
    contact_name: string;
    contact_phone: string;
    last_message: string | null;
    last_message_at: string; // timestamptz
    unread_count: number;
    created_at: string; // timestamptz
}

export interface WhatsappMessage {
    id: string; // uuid
    chat_id: string; // uuid
    user_id: string; // uuid
    content: string;
    is_from_me: boolean;
    created_at: string; // timestamptz
}