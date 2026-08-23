import { supabase } from './supabase';

/**
 * Validates a Twilio Webhook Signature using Web Crypto API (Cloudflare compatible).
 */
export async function validateTwilioSignature(
    authToken: string,
    signature: string,
    url: string,
    params: Record<string, any>
): Promise<boolean> {
    // Sort params by key
    const sortedKeys = Object.keys(params).sort();
    let data = url;
    for (const key of sortedKeys) {
        data += key + params[key];
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(authToken);
    const msgData = encoder.encode(data);

    // SubtleCrypto is available in Cloudflare Workers and most modern JS runtimes
    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );

    const sigArrayBuffer = await crypto.subtle.sign('HMAC', key, msgData);
    
    // Convert to Base64
    const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sigArrayBuffer)));

    return sigBase64 === signature;
}

/**
 * Ingests a Twilio call event.
 */
export async function ingestTwilioCall(params: any) {
    // Implementation for database insertion (Idempotent via twilio_call_sid)
    const { CallSid, From, To, CallStatus, Direction } = params;
    
    // Attribution logic would go here
    // ...
    
    return { success: true, sid: CallSid };
}
