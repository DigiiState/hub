import type { APIRoute } from 'astro';
import { validateTwilioSignature } from '../../../lib/twilio';

export const POST: APIRoute = async ({ request, url, locals }) => {
    try {
        const signature = request.headers.get('x-twilio-signature');
        const bodyText = await request.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));
        
        const runtime = locals.runtime as any;
        const authToken = runtime?.env?.TWILIO_AUTH_TOKEN || '';
        
        const isValid = await validateTwilioSignature(
            authToken,
            signature || '',
            url.toString(),
            params
        );

        return new Response(JSON.stringify({ 
            status: 'SIG_VALIDATED', 
            isValid,
            hasSig: !!signature
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const GET: APIRoute = async () => {
    return new Response('Method Not Allowed', { status: 405 });
};
