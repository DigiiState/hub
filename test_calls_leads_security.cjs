const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');
require('dotenv').config({ path: '/Users/lydiai/Desktop/Lori Home/ventures/DigiiState/hub/.env.dedicated' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function runSecurityTests() {
    console.log('--- CALLS & LEADS RENTER SECURITY VERIFICATION ---');
    const results = [];
    const password = 'ProductionPassword123!';

    const logResult = (identity, action, resource, expected, actual, status) => {
        results.push({ identity, action, resource, expected, actual, status });
        console.log(`[${status}] ${identity} -> ${action} ${resource} | Expected: ${expected} | Actual: ${actual}`);
    };

    try {
        // 1. Setup Identities
        const { data: userA } = await adminClient.from('profiles').select('id').eq('email', 'partner_a@test.com').single();
        const { data: userB } = await adminClient.from('profiles').select('id').eq('email', 'partner_b@test.com').single();

        const clientA = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
        await clientA.auth.signInWithPassword({ email: 'partner_a@test.com', password });

        const clientB = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
        await clientB.auth.signInWithPassword({ email: 'partner_b@test.com', password });

        // 2. Setup Test Data
        const { data: orgA } = await adminClient.from('renter_organizations').upsert({ name: 'Renter Org A' }, { onConflict: 'name' }).select().single();
        const { data: orgB } = await adminClient.from('renter_organizations').upsert({ name: 'Renter Org B' }, { onConflict: 'name' }).select().single();

        await adminClient.from('renter_memberships').upsert([
            { organization_id: orgA.id, profile_id: userA.id, role: 'OWNER' },
            { organization_id: orgB.id, profile_id: userB.id, role: 'OWNER' }
        ], { onConflict: 'organization_id,profile_id' });

        const { data: callA } = await adminClient.from('calls').upsert({
            twilio_call_sid: 'CA_TEST_A_SUPP',
            direction: 'inbound',
            caller_number: '+1234567890',
            destination_number: '+1098765432',
            started_at: new Date().toISOString(),
            status: 'completed',
            renter_org_id: orgA.id
        }, { onConflict: 'twilio_call_sid' }).select().single();

        const { data: callB } = await adminClient.from('calls').upsert({
            twilio_call_sid: 'CA_TEST_B_SUPP',
            direction: 'inbound',
            caller_number: '+1999999999',
            destination_number: '+1098765432',
            started_at: new Date().toISOString(),
            status: 'completed',
            renter_org_id: orgB.id
        }, { onConflict: 'twilio_call_sid' }).select().single();

        // 3. Authenticated Isolation Tests
        // Renter A -> Own Call
        const { data: rA_own } = await clientA.from('calls').select('*').eq('id', callA.id);
        logResult('Renter A', 'Read', 'Own Call', 'Allowed', rA_own?.length === 1 ? 'Found' : 'Missing', rA_own?.length === 1 ? 'LIVE TESTED — PASS' : 'LIVE TESTED — FAIL');

        // Renter A -> Other Call
        const { data: rA_other } = await clientA.from('calls').select('*').eq('id', callB.id);
        logResult('Renter A', 'Read', 'Other Call', 'Denied', rA_other?.length === 0 ? 'Denied' : 'Leaked', rA_other?.length === 0 ? 'LIVE TESTED — PASS' : 'LIVE TESTED — FAIL');

        // Unauthenticated -> Call
        const unauth = createClient(supabaseUrl, supabaseAnonKey);
        const { data: ua_call } = await unauth.from('calls').select('*');
        logResult('Unauthenticated', 'Read', 'Calls', 'Denied', ua_call?.length === 0 ? 'Denied' : 'Leaked', ua_call?.length === 0 ? 'LIVE TESTED — PASS' : 'LIVE TESTED — FAIL');

        // Admin -> All
        const admin = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
        const { data: admAuth, error: admAuthErr } = await admin.auth.signInWithPassword({ email: 'admin@digiistate.com', password });
        if (admAuthErr) console.error('Admin Auth Error:', admAuthErr.message);
        console.log('Admin Authenticated ID:', admAuth.user.id);

        const { data: adm_prof } = await admin.from('profiles').select('role').single();
        console.log('Admin Profile Role:', adm_prof?.role);

        const { data: adm_all } = await admin.from('calls').select('*');
        logResult('Authorized Admin', 'Read', 'Global Calls', 'Allowed', adm_all?.length >= 2 ? 'Found All' : 'Restricted', adm_all?.length >= 2 ? 'LIVE TESTED — PASS' : 'LIVE TESTED — FAIL');
        console.log('Admin visible calls count:', adm_all?.length);

        console.log('\n--- FINAL VERIFICATION COMPLETE ---');
        console.table(results);

    } catch (err) {
        console.error('Security Test Error:', err);
    }
}

runSecurityTests();
