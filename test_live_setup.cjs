const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');
require('dotenv').config({ path: '/Users/lydiai/Desktop/Lori Home/ventures/DigiiState/hub/.env.dedicated' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setupTest() {
    console.log('--- LIVE CALL CERTIFICATION: SETUP ---');
    
    const testNumber = '+14438318288';
    
    // 1. Get Test Asset and Renter
    const { data: asset } = await supabase.from('assets').select('id, domain').eq('domain', 'phoenixmdseptic.com').single();
    const { data: renter } = await supabase.from('profiles').select('id, email').eq('email', 'partner_a@test.com').single();
    const { data: org } = await supabase.from('renter_organizations').select('id').eq('name', 'Renter Org A').single();

    if (!asset || !org) {
        console.error('Test infrastructure missing (Asset/Org).');
        return;
    }

    console.log(`Mapping ${testNumber} to ${asset.domain}...`);
    
    // 2. Create Tracking Number Mapping
    const { data: tracking, error: trackErr } = await supabase.from('tracking_numbers').upsert({
        twilio_phone_number: testNumber,
        twilio_sid: 'PN_TEST_CERT',
        asset_id: asset.id,
        renter_org_id: org.id,
        forwarding_destination: '+15551234567', // Dummy forwarding
        status: 'ACTIVE'
    }, { onConflict: 'twilio_phone_number' }).select().single();

    if (trackErr) {
        console.error('Mapping Error:', trackErr.message);
    } else {
        console.log('EXISTING NUMBER AVAILABLE & MAPPED: PASS');
    }
}

setupTest();
