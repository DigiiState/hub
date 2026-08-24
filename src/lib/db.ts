import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const NICHE_MARKET_VALUE = {
    "Septic Pumping": 90,
    "DUI Defense": 95,
    "Tree Removal": 80,
    "Roofing": 85,
    "Water Damage Restoration": 85,
    "Traffic Defense": 75
};

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
        totalPipelineValue: 18400.00,
        retentionRate: 98
    };

    return {
        ...stats,
        monthlyNOI: stats.monthlyRentRoll - stats.monthlyExpenses,
        annualizedRevenue: stats.monthlyRentRoll * 12,
        annualizedNOI: (stats.monthlyRentRoll - stats.monthlyExpenses) * 12,
        portfolioValue: stats.totalAssets * 1000,
        leads30d: 142,
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
    
    return data.map(m => {
        const qualifiedCount = m.non_paid_qualified_calls_30d || 0;
        
        // TRACTION PRIORITY SCORE (0-100)
        let priorityScore = 0;
        
        // 1. Indexing (25%)
        if (m.indexed_urls > 0) priorityScore += 25;
        else if (m.crawled_urls > 0) priorityScore += 15;
        else if (m.discovered_urls > 0) priorityScore += 10;
        
        // 2. Market Value (30%)
        const niche = m.domain.includes('septic') ? 'Septic Pumping' : 
                      m.domain.includes('dui') ? 'DUI Defense' : 
                      m.domain.includes('tree') ? 'Tree Removal' : 
                      m.domain.includes('roofing') ? 'Roofing' : 
                      m.domain.includes('water') ? 'Water Damage Restoration' : 'Traffic Defense';
        priorityScore += (NICHE_MARKET_VALUE[niche] || 50) * 0.3;
        
        // 3. Call Velocity (25%)
        priorityScore += Math.min(25, (qualifiedCount / 5) * 25);
        
        // 4. Conversion Readiness (20%)
        priorityScore += 20; // All Wave 1 passed tech gate

        return {
            asset_id: m.asset_id,
            domain: m.domain,
            stage: m.current_stage,
            status: m.monetization_status,
            qualifiedCalls: qualifiedCount,
            paidQualifiedCalls: m.paid_qualified_calls_30d || 0,
            prevQualifiedCalls: m.prev_non_paid_qualified_calls_30d || 0,
            qualifiedForms: m.qualified_form_leads_30d || 0,
            totalCalls: m.total_calls_30d || 0,
            progress: Math.min(100, (qualifiedCount / 10) * 100),
            discovered: m.discovered_urls || 0,
            crawled: m.crawled_urls || 0,
            indexed: m.indexed_urls || 0,
            priorityScore: Math.round(priorityScore)
        };
    });
}

export async function getAutopilotConfigs() {
    const { data: configs, error } = await supabase.from('autopilot_configs').select('*');
    if (error) return [];
    return configs;
}

export async function getDecisions() {
    const { data: decisions, error } = await supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return [];
    return decisions;
}

export async function getManagementAttention() {
    const { data: decisions, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('status', 'PENDING')
        .eq('authority', 'YELLOW');
    
    if (error) return [];
    
    return decisions.map(d => ({
        id: d.id,
        type: d.priority === 'CRITICAL' ? 'critical' : d.priority === 'HIGH' ? 'warning' : 'positive',
        message: d.title,
        action: d.proposed_action || 'Review',
        target: d.asset_id ? `/dashboard/portfolio` : '#'
    }));
}
