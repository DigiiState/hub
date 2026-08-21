import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://zjfprtrptrdudqxprobw.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bDPQ2m_ufxbdUrFnaSm4bg_zl6yZfwo';

// Global shim for WebSocket during Astro static build (Node context)
if (typeof global !== 'undefined' && !global.WebSocket) {
    global.WebSocket = class {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { enabled: false }
});
