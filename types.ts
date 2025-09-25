// types.ts

export interface Stage {
  id: string;
  user_id: string;
  title: string;
  order: number;
  color: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Client {
  id: string;
  stage_id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  treatment: string;
  created_at: string;
  order: number;
  description?: string;
  address?: string;
  avatar_url?: string | null;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string | null;
  client_id?: string | null;
  created_at: string;
}

export type ClientTask = Task & { client_id: string };

export interface Appointment {
  id: string;
  client_id: string;
  clientName: string;
  treatment: string;
  date: Date | string;
  reminder_minutes_before: number | null;
  reminder_sent: boolean;
  notes?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date | string;
  client_id: string | null;
  service_id: string | null;
  status: 'paid' | 'pending' | 'overdue';
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  content: string | object;
  type: 'standard' | 'prescription';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BudgetTemplateData {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl: string | null;
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
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  business_email?: string;
  avatar_url: string | null;
  business_name: string;
  business_phone?: string;
  business_address?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  subscription_status: 'active' | 'pending_payment' | 'expired' | 'canceled';
  subscription_expires_at: string | null;
  budget_template?: BudgetTemplateData;
  prescription_template?: PrescriptionTemplate['template_data'];
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
    last_message: string;
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

// --- AI Agent Types ---

export interface KnowledgeSource {
  id: string;
  type: 'file';
  fileName: string;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
}

export interface AgentIntegration {
  id: string;
  channel: 'whatsapp';
  channel_id: string; // e.g., phone number
  is_active: boolean;
}

export interface AIAgent {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'inactive';
  llm_model: 'gemini-2.5-flash' | 'openai/gpt-4o' | 'anthropic/claude-3.5-sonnet';
  api_key: string | null; // Stored securely
  system_prompt: string;
  knowledge_sources: KnowledgeSource[];
  integrations: AgentIntegration[];
  created_at: string;
  updated_at: string;
}