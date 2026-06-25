const apiBaseUrl = import.meta.env.VITE_API_URL ?? '/api';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const appConfig = {
  apiBaseUrl,
  supabaseUrl,
  supabaseKey,
  offlineDatabaseName: 'AgroTechOfflineDB'
};