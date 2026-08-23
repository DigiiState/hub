import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
    return new Response(JSON.stringify({ status: 'REACHABLE' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

export const GET: APIRoute = async () => {
    return new Response('Method Not Allowed', { status: 405 });
};
