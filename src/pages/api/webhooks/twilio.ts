import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const bodyText = await request.text();
        const runtime = (locals as any).runtime;
        const env = runtime?.env || {};
        
        return new Response(JSON.stringify({ 
            status: 'DEBUG', 
            body: bodyText,
            hasAuthToken: !!env.TWILIO_AUTH_TOKEN
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
