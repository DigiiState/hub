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

export const managementAttention = [
	{ type: 'critical', message: 'Leads declined 12% for "Annapolis DUI Law" in previous 30 days.', action: 'Audit SEO', target: '/dashboard/portfolio' },
	{ type: 'positive', message: 'Asset "Annapolis Tree" is now lease ready (#3 Google).', action: 'Trigger Outreach', target: '/dashboard/acquisitions' },
];
