import type { APIRoute } from 'astro';
import { updateDecisionStatus } from '../../lib/db';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { decisionId, status, rationale } = body;

        // In a real app, we'd get the actorId from the session
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const result = await updateDecisionStatus(decisionId, status, user.id, rationale);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
