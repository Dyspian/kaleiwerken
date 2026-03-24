import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://sjfosmcpbekkokmedwil.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZm9zbWNwYmVra29rbWVkd2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDAwMzQsImV4cCI6MjA4OTA3NjAzNH0.J4merO1jIzh3gysLZJx-h6hIPtUNfNeSrcovcA4rTVo";

// Voeg een session lock toe om concurrente toegang te voorkomen
let sessionLock = false;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Voeg een custom storage key toe om conflicts te voorkomen
    storageKey: 'vanroey-kalei-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-application-name': 'vanroey-kaleiwerken',
    },
  },
});

// Voeg een helper functie toe om session locks te beheren
export const withSessionLock = async <T,>(fn: () => Promise<T>): Promise<T> => {
  while (sessionLock) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  sessionLock = true;
  try {
    return await fn();
  } finally {
    sessionLock = false;
  }
};