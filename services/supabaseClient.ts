// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Hardcoding the Supabase URL and Anon Key to fix initialization error.
// In a real application, these should be loaded from environment variables.
const supabaseUrl = "https://bdvrdbbxxeokajsomwbu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJkYmJ4eGVva2Fqc29td2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTA2NTAsImV4cCI6MjA3Mzg4NjY1MH0.RU-d7d19iv1MdfpGQf2M3YcCk1Cabfsw98Mxv2VrdhE";


if (!supabaseUrl || !supabaseAnonKey) {
  // This check will now always pass, but it's good practice to keep it.
  console.error("Supabase URL and Anon Key are not provided.");
  throw new Error("Supabase client could not be initialized.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);