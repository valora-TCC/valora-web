import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing. Auth will not work until .env is configured.');
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder',
  {
    auth: {
      storage: window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

for (const key of Object.keys(localStorage)) {
  if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
    localStorage.removeItem(key);
  }
}
