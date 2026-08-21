import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
        console.warn('Supabase credentials missing from environment. Application may malfunction.');
    } else {
        throw new Error('CRITICAL: Supabase credentials missing in Production environment.');
    }
}

// Global shim for WebSocket during Astro static build (Node context)
if (typeof global !== 'undefined' && !global.WebSocket) {
    global.WebSocket = class {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { enabled: false }
});
