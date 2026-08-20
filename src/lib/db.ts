import { supabase } from './supabase';

export async function getPortfolioStats() {
    const { data: assets } = await supabase.from('assets').select('*');
    const { data: leads } = await supabase.from('leads').select('*');
    
    const totalAssets = assets?.length || 0;
    const leasedAssets = assets?.filter(a => a.status === 'Leased').length || 0;
    const rankingAssets = assets?.filter(a => a.status === 'Ranking').length || 0;
    const availableAssets = totalAssets - leasedAssets;
    
    // Aggregate financial metrics (simplified for now)
    const monthlyRentRoll = assets?.reduce((acc, a) => acc + (a.status === 'Leased' ? 1250 : 0), 0) || 0;
    
    return {
        totalAssets,
        territories: totalAssets,
        states: 1,
        leasedAssets,
        availableAssets,
        rankingAssets,
        monthlyRentRoll,
        monthlyExpenses: 60.50,
        monthlyNOI: monthlyRentRoll - 60.50,
        annualizedRevenue: monthlyRentRoll * 12,
        annualizedNOI: (monthlyRentRoll - 60.50) * 12,
        portfolioValue: totalAssets * 1000,
        leads30d: leads?.length || 0,
        avgCPL: 0.42,
        avgHealthScore: assets?.reduce((acc, a) => acc + (a.health_score || 0), 0) / totalAssets || 0,
        prevLeads30d: 128,
        prevRentRoll: 3125.00,
        totalPipelineValue: 18400.00,
        retentionRate: 98,
    };
}

export async function getAssets() {
    const { data } = await supabase
        .from('assets')
        .select('*, rankings(*)');
    
    return data?.map(a => ({
        id: a.id,
        name: a.niche + " " + a.city,
        domain: a.domain,
        city: a.city,
        state: a.state,
        health: a.health_score,
        stage: a.status,
        rank: `#${a.rankings?.[0]?.google_rank || '--'}`,
        leads: 0, // Should fetch from leads table
        capital: "$10.46",
        renter: a.status === 'Leased' ? 'Young Septic Services' : 'None',
        registrar: a.registrar,
        expDate: a.expiry_date,
        ranks: {
            google: `#${a.rankings?.[0]?.google_rank || '--'}`,
            bing: `#${a.rankings?.[0]?.bing_rank || '--'}`,
            yahoo: `#${a.rankings?.[0]?.yahoo_rank || '--'}`,
            ddg: `#${a.ranks?.[0]?.ddg_rank || '--'}`
        }
    })) || [];
}

export async function getLeads() {
    const { data } = await supabase.from('leads').select('*, assets(*)');
    return data || [];
}

export async function getRenters() {
    const { data } = await supabase.from('leases').select('*, profiles(*)');
    return data || [];
}

export async function getAutopilotConfigs() {
    const { data } = await supabase.from('autopilot_configs').select('*').order('display_name');
    return data || [];
}

export async function getAutonomousRuns(limit = 10) {
    const { data } = await supabase
        .from('autonomous_runs')
        .select('*, assets(domain)')
        .order('started_at', { ascending: false })
        .limit(limit);
    return data || [];
}

export async function getDeadLetterQueue() {
    const { data } = await supabase
        .from('dead_letter_queue')
        .select('*, autonomous_runs(*)')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
    return data || [];
}

export async function getPendingApprovals() {
    const { data } = await supabase
        .from('approvals')
        .select('*')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });
    return data || [];
}

export async function getEngineeringTickets() {
    const { data } = await supabase
        .from('engineering_tickets')
        .select('*')
        .order('created_at', { ascending: false });
    return data || [];
}

export async function getDecisions() {
    const { data } = await supabase
        .from('decisions')
        .select('*, assets(niche, city, domain)')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });
    return data || [];
}

export async function updateDecisionStatus(decisionId: string, status: string, actorId: string, rationale?: string) {
    const { data: decision, error: fetchError } = await supabase
        .from('decisions')
        .select('*')
        .eq('id', decisionId)
        .single();

    if (fetchError || !decision) throw new Error('Decision not found');

    const oldStatus = decision.status;
    let newStatus = status;

    if (status === 'APPROVED') {
        // Enforce spending ceiling governance
        const cost = Number(decision.cost || 0);
        const ceiling = decision.cost_ceiling ? Number(decision.cost_ceiling) : null;
        
        if (ceiling !== null && cost > ceiling) {
            throw new Error(`Cost $${cost} exceeds ceiling $${ceiling}`);
        }

        // Enforce Kill Switch check
        const { data: globalConfig } = await supabase
            .from('autopilot_configs')
            .select('is_active')
            .eq('id', 'global')
            .single();

        if (globalConfig && !globalConfig.is_active) {
            newStatus = 'APPROVED_WAITING_FOR_CONTROL';
        } else {
            newStatus = 'EXECUTION_QUEUED';
        }
    }

    const { error: updateError } = await supabase
        .from('decisions')
        .update({ 
            status: newStatus, 
            decision_by: actorId, 
            decided_at: new Date().toISOString(),
            outcome_summary: rationale
        })
        .eq('id', decisionId);

    if (updateError) throw updateError;

    // Audit Trail
    await supabase.from('decision_audit_log').insert({
        decision_id: decisionId,
        action: `DECISION_${status}`,
        old_status: oldStatus,
        new_status: newStatus,
        actor_id: actorId,
        metadata: { rationale }
    });

    return { success: true, newStatus };
}

export async function createDecision(decision: any) {
    const { data, error } = await supabase
        .from('decisions')
        .insert({
            ...decision,
            created_at: new Date().toISOString(),
            status: 'PENDING'
        })
        .select()
        .single();
    
    if (error) throw error;
    
    // Initial Audit
    await supabase.from('decision_audit_log').insert({
        decision_id: data.id,
        action: 'DECISION_CREATED',
        new_status: 'PENDING',
        metadata: { source: 'Intelligence Engine' }
    });
    
    return data;
}

export const managementAttention = [
	{ type: 'critical', message: 'Leads declined 12% for "Annapolis DUI Law" in previous 30 days.', action: 'Audit SEO', target: '/dashboard/portfolio' },
	{ type: 'positive', message: 'Asset "Annapolis Tree" is now lease ready (#3 Google).', action: 'Trigger Outreach', target: '/dashboard/acquisitions' },
];
