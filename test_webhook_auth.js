async function validateTwilioSignature(
    authToken,
    signature,
    url,
    params
) {
    const sortedKeys = Object.keys(params).sort();
    let data = url;
    for (const key of sortedKeys) {
        data += key + params[key];
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(authToken);
    const msgData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );

    const sigArrayBuffer = await crypto.subtle.sign('HMAC', key, msgData);
    const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sigArrayBuffer)));

    return sigBase64 === signature;
}

async function testSignature() {
    console.log('--- WEBHOOK AUTHENTICATION TEST ---');
    
    const authToken = '12345';
    const url = 'https://digiistate.com/api/webhooks/twilio';
    const params = {
        CallSid: 'CA123',
        From: '+1234567890',
        To: '+1098765432'
    };

    // 1. Generate Valid Signature
    const sortedKeys = Object.keys(params).sort();
    let data = url;
    for (const key of sortedKeys) {
        data += key + params[key];
    }
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(authToken);
    const msgData = encoder.encode(data);
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const sigArrayBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const validSignature = btoa(String.fromCharCode(...new Uint8Array(sigArrayBuffer)));

    // Test 1: Valid
    const res1 = await validateTwilioSignature(authToken, validSignature, url, params);
    console.log('Valid Signature Accepted:', res1 ? 'PASS' : 'FAIL');

    // Test 2: Missing
    const res2 = await validateTwilioSignature(authToken, '', url, params);
    console.log('Missing Signature Rejected:', !res2 ? 'PASS' : 'FAIL');

    // Test 3: Invalid
    const res3 = await validateTwilioSignature(authToken, 'invalid', url, params);
    console.log('Invalid Signature Rejected:', !res3 ? 'PASS' : 'FAIL');

    // Test 4: Modified Payload
    const modifiedParams = { ...params, From: '+1999999999' };
    const res4 = await validateTwilioSignature(authToken, validSignature, url, modifiedParams);
    console.log('Modified Payload Rejected:', !res4 ? 'PASS' : 'FAIL');
}

testSignature();
