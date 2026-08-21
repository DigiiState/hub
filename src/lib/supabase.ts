import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Global shim for WebSocket during Astro static build (Node context)
if (typeof global !== 'undefined' && !global.WebSocket) {
    global.WebSocket = class {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { enabled: false }
});
