import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    // During local development or if env vars are missing, we log a warning.
    // In a fully configured production environment, these must be provided via the dashboard.
    console.warn('CRITICAL: Supabase credentials missing. Connection to the data layer will fail.');
}

// Global shim for WebSocket during Astro static build (Node context)
if (typeof global !== 'undefined' && !global.WebSocket) {
    global.WebSocket = class {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { enabled: false }
});
