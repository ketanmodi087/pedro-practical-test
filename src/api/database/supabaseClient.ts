import { createClient } from '@supabase/supabase-js'; // Import the Supabase client creation function

// Define the Supabase URL and Anon Key (these values should be stored securely in environment variables in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // URL of the Supabase instance
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Supabase Anon Key

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
