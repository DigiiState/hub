import type { APIRoute } from 'astro';
import { validateTwilioSignature, ingestTwilioCall } from '../../../lib/twilio';

export const POST: APIRoute = async ({ request, url }) => {
    const signature = request.headers.get('x-twilio-signature');
    const bodyText = await request.text();
    const params = Object.fromEntries(new URLSearchParams(bodyText));

    // SECURITY: Signature Validation
    const authToken = process.env.TWILIO_AUTH_TOKEN || ''; 
    const isValid = await validateTwilioSignature(
        authToken,
        signature || '',
        url.toString(),
        params
    );

    if (!isValid && process.env.NODE_ENV === 'production') {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const call = await ingestTwilioCall(params);
        return new Response(JSON.stringify({ success: true, callId: call.id }));
    } catch (e: any) {
        console.error('Webhook Ingestion Failed:', e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
