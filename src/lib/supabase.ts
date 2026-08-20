import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Global shim for WebSocket during Astro static build (Node context)
if (typeof global !== 'undefined' && !global.WebSocket) {
    global.WebSocket = class {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { enabled: false }
});
