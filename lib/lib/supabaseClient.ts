import { createClient } from '@supabase/supabase-js';

// Legge le variabili d’ambiente dal file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

