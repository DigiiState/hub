import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

async function validateTwilioSignature(
    authToken: string,
    signature: string,
    url: string,
    params: Record<string, any>
): Promise<boolean> {
    const sortedKeys = Object.keys(params).sort();
    let data = url;
    for (const key of sortedKeys) {
        data += key + params[key];
    }
    const encoder = new TextEncoder();
    const keyData = encoder.encode(authToken);
    const msgData = encoder.encode(data);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const sigArrayBuffer = await crypto.subtle.sign('HMAC', key, msgData);
    const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sigArrayBuffer)));
    return sigBase64 === signature;
}

export const POST: APIRoute = async ({ request, url, locals }) => {
    try {
        const bodyText = await request.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));
        
        const runtime = (locals as any).runtime;
        const env = runtime?.env || {};
        const authToken = env.TWILIO_AUTH_TOKEN || '';
        
        const signature = request.headers.get('x-twilio-signature');
        const isValid = await validateTwilioSignature(authToken, signature || '', url.toString(), params);

        if (!isValid && import.meta.env.PROD) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Initialize Supabase inside handler
        const supabase = createClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
            { auth: { persistSession: false } }
        );

        const { CallSid, From, To, CallStatus, Direction } = params;
        
        // 1. Resolve Tracking Number
        const { data: tracking } = await supabase
            .from('tracking_numbers')
            .select('*, assets(id, domain)')
            .eq('twilio_phone_number', To)
            .single();

        // 2. Create Lead (Idempotent)
        let leadId = null;
        if (tracking) {
            const { data: lead } = await supabase.from('leads').upsert({
                customer_phone: From,
                territory_id: tracking.territory_id,
                status: 'NEW'
            }, { onConflict: 'customer_phone,territory_id' }).select().single();
            leadId = lead?.id;
        }

        // 3. Log Call
        const { error: insertError } = await supabase.from('calls').upsert({
            twilio_call_sid: CallSid,
            direction: Direction === 'inbound' ? 'inbound' : 'outbound',
            caller_number: From,
            destination_number: To,
            started_at: new Date().toISOString(),
            status: CallStatus ? CallStatus.toLowerCase() : 'completed',
            asset_id: tracking?.asset_id,
            lead_id: leadId
        }, { onConflict: 'twilio_call_sid' });

        if (insertError) throw insertError;

        return new Response(JSON.stringify({ success: true, sid: CallSid }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const GET: APIRoute = async () => {
    return new Response('Method Not Allowed', { status: 405 });
};
