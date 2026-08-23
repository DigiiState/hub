import type { APIRoute } from 'astro';
import { validateTwilioSignature, ingestTwilioCall } from '../../../lib/twilio';

export const POST: APIRoute = async ({ request, url, locals }) => {
    const signature = request.headers.get('x-twilio-signature');
    const bodyText = await request.text();
    const params = Object.fromEntries(new URLSearchParams(bodyText));

    // SECURITY: Signature Validation
    const authToken = (locals.runtime as any)?.env?.TWILIO_AUTH_TOKEN || import.meta.env.TWILIO_AUTH_TOKEN || ''; 
    const isValid = await validateTwilioSignature(
        authToken,
        signature || '',
        url.toString(),
        params
    );

    if (!isValid && import.meta.env.PROD) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const result = await ingestTwilioCall(params);
        return new Response(JSON.stringify({ success: true, callId: (result as any).sid }));
    } catch (e: any) {
        console.error('Webhook Ingestion Failed:', e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

export const GET: APIRoute = async () => {
    return new Response('Method Not Allowed', { status: 405 });
};
