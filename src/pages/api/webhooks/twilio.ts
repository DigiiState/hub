import type { APIRoute } from 'astro';

async function validateTwilioSignature(
    authToken: string,
    signature: string,
    url: string,
    params: Record<string, any>
): Promise<boolean> {
    const sortedKeys = Object.keys(params).sort();
    let data = url;
    for (const key of sortedKeys) {
        data += key + params[key];
    }
    const encoder = new TextEncoder();
    const keyData = encoder.encode(authToken);
    const msgData = encoder.encode(data);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const sigArrayBuffer = await crypto.subtle.sign('HMAC', key, msgData);
    const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sigArrayBuffer)));
    return sigBase64 === signature;
}

export const POST: APIRoute = async ({ request, url, locals }) => {
    try {
        const bodyText = await request.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));
        
        const runtime = (locals as any).runtime;
        const env = runtime?.env || {};
        const authToken = env.TWILIO_AUTH_TOKEN || '';
        
        const signature = request.headers.get('x-twilio-signature');
        const isValid = await validateTwilioSignature(authToken, signature || '', url.toString(), params);

        return new Response(JSON.stringify({ 
            status: 'SIG_CHECKED', 
            isValid,
            hasSig: !!signature
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

export const GET: APIRoute = async () => {
    return new Response('Method Not Allowed', { status: 405 });
};
