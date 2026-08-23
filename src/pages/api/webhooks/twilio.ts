import type { APIRoute } from 'astro';
import { validateTwilioSignature, ingestTwilioCall } from '../../../lib/twilio';

export const POST: APIRoute = async ({ request, url, locals }) => {
    try {
        const signature = request.headers.get('x-twilio-signature');
        const bodyText = await request.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));

        // SECURITY: Signature Validation
        const runtime = locals.runtime as any;
        const authToken = runtime?.env?.TWILIO_AUTH_TOKEN || import.meta.env.TWILIO_AUTH_TOKEN || ''; 
        
        const isValid = await validateTwilioSignature(
            authToken,
            signature || '',
            url.toString(),
            params
        );

        if (!isValid && import.meta.env.PROD) {
            console.error('Twilio Signature Validation Failed');
            return new Response('Unauthorized', { status: 401 });
        }

        const result = await ingestTwilioCall(params);
        return new Response(JSON.stringify({ success: true, callId: (result as any).sid }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        console.error('CRITICAL: Webhook Ingestion Failed:', e.message);
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const GET: APIRoute = async () => {
    return new Response('Method Not Allowed', { status: 405 });
};
