import { createClient } from '@supabase/supabase-js';
import { appConfig } from '@shared/config'; // <-- Ajusta la ruta según dónde esté tu appConfig

const supabaseUrl = appConfig.supabaseUrl;
const supabaseKey = appConfig.supabaseKey;

// Esta es la validación que te salía en la pantalla blanca de Edge
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or key not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', // Evita que explote si viene vacío un milisegundo
  supabaseKey || 'placeholder-key'
);