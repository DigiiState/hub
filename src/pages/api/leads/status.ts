import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    const { leadId, status } = await request.json();

    // 1. Get current status for audit
    const { data: lead } = await supabase
        .from('leads')
        .select('status')
        .eq('id', leadId)
        .single();

    if (!lead) {
        return new Response(JSON.stringify({ error: 'Lead not found' }), { status: 404 });
    }

    // 2. Update status
    const { error: updateError } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

    if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    // 3. Log Event (Immutable Audit Trail)
    const { error: auditError } = await supabase
        .from('lead_events')
        .insert({
            lead_id: leadId,
            previous_state: lead.status,
            new_state: status,
            source: 'renter_portal',
            timestamp: new Date().toISOString()
        });

    if (auditError) {
        console.error('Audit Log Error:', auditError);
    }

    return new Response(JSON.stringify({ success: true }));
};
