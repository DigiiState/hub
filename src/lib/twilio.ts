import { validateRequest } from 'twilio/lib/webhooks/webhooks';
import { supabase } from './supabase';

/**
 * Validates a Twilio Webhook Signature using official SDK.
 */
export async function validateTwilioSignature(
    authToken: string,
    signature: string,
    url: string,
    params: Record<string, any>
): Promise<boolean> {
    return validateRequest(authToken, signature, url, params);
}

/**
 * Idempotent Lead/Call Ingestion
 */
export async function ingestTwilioCall(callData: any) {
    const { 
        CallSid, 
        From, 
        To, 
        Direction, 
        Timestamp, 
        Status 
    } = callData;

    // 1. Resolve Attribution
    const { data: tracking } = await supabase
        .from('tracking_numbers')
        .select('*')
        .eq('twilio_phone_number', To)
        .eq('status', 'ACTIVE')
        .single();

    if (!tracking) {
        // Orphan Reconciliation Path
        console.warn(`ORPHAN CALL: No tracking number mapping found for ${To}`);
    }

    // 2. Upsert Call (Idempotency via twilio_call_sid)
    const { data: call, error: callError } = await supabase
        .from('calls')
        .upsert({
            twilio_call_sid: CallSid,
            caller_number: From,
            destination_number: To,
            direction: Direction === 'inbound' ? 'inbound' : 'outbound',
            started_at: Timestamp,
            status: Status,
            renter_org_id: tracking?.renter_org_id,
            asset_id: tracking?.asset_id,
            territory_id: tracking?.territory_id,
            updated_at: new Date().toISOString()
        }, { onConflict: 'twilio_call_sid' })
        .select()
        .single();

    if (callError) throw callError;

    // 3. Create Lead if New Inbound
    if (Direction === 'inbound' && !call.lead_id) {
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .insert({
                asset_id: tracking?.asset_id,
                customer_phone: From,
                status: 'NEW',
                renter_org_id: tracking?.renter_org_id
            })
            .select()
            .single();
        
        if (!leadError) {
            await supabase.from('calls').update({ lead_id: lead.id }).eq('id', call.id);
        }
    }

    return call;
}
