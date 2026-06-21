import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

if (!url || !key) {
  // No lanzar error en tiempo de importación; exportamos un cliente "vacío" para que la app cargue.
  console.warn('Supabase URL or key not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env');
}

export const supabase: SupabaseClient = createClient(url ?? '', key ?? '');

export default supabase;
