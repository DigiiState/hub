import type { APIRoute } from 'astro';
import { createDecision } from '../../../lib/db';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        
        // Mocking decision data for the Yellow Action
        const decisionData = {
            decision_id: `DEC-${Date.now().toString().slice(-4)}`,
            type: body.type || 'OTHER',
            priority: body.priority || 'NORMAL',
            title: body.title,
            rationale: body.rationale,
            cost: body.cost || 0,
            payback_period: body.payback || 'TBD',
            risk_level: body.risk || 'LOW',
            evidence: body.evidence || {},
            authority: 'YELLOW',
            recommendation: 'APPROVE',
            originating_agent: 'Lori Intelligence Engine'
        };

        const result = await createDecision(decisionData);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
