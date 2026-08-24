import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getPortfolioStats() {
    const { data: assets, error } = await supabase.from('assets').select('*');
    if (error) return null;

    const stats = {
        totalAssets: assets.length,
        territories: assets.length,
        states: new Set(assets.map(a => a.state)).size,
        leasedAssets: assets.filter(a => a.current_stage === 'LEASED').length,
        availableAssets: assets.filter(a => a.current_stage === 'AVAILABLE_FOR_RENT').length,
        rankingAssets: assets.filter(a => a.current_stage === 'RANKING').length,
        monthlyRentRoll: assets.reduce((acc, a) => acc + (a.monthly_rent || 0), 0),
        monthlyExpenses: 60.50,
        avgHealthScore: Math.round(assets.reduce((acc, a) => acc + (a.health || 0), 0) / assets.length) || 0,
        totalPipelineValue: 18400.00
    };

    return {
        ...stats,
        monthlyNOI: stats.monthlyRentRoll - stats.monthlyExpenses,
        annualizedRevenue: stats.monthlyRentRoll * 12,
        annualizedNOI: (stats.monthlyRentRoll - stats.monthlyExpenses) * 12,
        portfolioValue: stats.totalAssets * 1000,
        leads30d: 142, // To be replaced by live count
        prevLeads30d: 128,
        prevRentRoll: 3125.00
    };
}

export async function getAssets() {
    const { data, error } = await supabase
        .from('assets')
        .select(`
            *,
            rankings (
                google_rank,
                bing_rank,
                yahoo_rank,
                ddg_rank,
                recorded_at
            )
        `)
        .order('domain');
    
    if (error) return [];
    return data;
}

export async function getMonetizationMetrics() {
    const { data, error } = await supabase
        .from('asset_readiness_metrics')
        .select('*');
    
    if (error) {
        console.error('Error fetching monetization metrics:', error);
        return [];
    }
    
    return data.map(m => ({
        asset_id: m.asset_id,
        domain: m.domain,
        stage: m.current_stage,
        status: m.monetization_status,
        qualifiedCalls: m.qualified_calls_30d,
        prevQualifiedCalls: m.prev_qualified_calls_30d,
        spamCalls: m.spam_calls_30d,
        qualifiedForms: m.qualified_form_leads_30d,
        totalCalls: m.total_calls_30d,
        progress: Math.min(100, (m.qualified_calls_30d / 10) * 100),
        discovered: m.discovered_urls || 0,
        crawled: m.crawled_urls || 0,
        indexed: m.indexed_urls || 0
    }));
}

export async function getAutopilotConfigs() {
    const { data, error } = await supabase.from('autopilot_configs').select('*');
    if (error) return [];
    return data;
}

export async function getDecisions() {
    const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return [];
    return data;
}

export async function updateDecisionStatus(decisionId: string, status: string, rationale: string) {
    const { error } = await supabase
        .from('decisions')
        .update({ 
            status, 
            outcome_summary: rationale,
            decided_at: new Date().toISOString()
        })
        .eq('id', decisionId);
    return { error };
}
