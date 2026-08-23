import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, url }) => {
    const recordingId = url.searchParams.get('id');
    
    // 1. Auth Gate: Check if user has access to this recording
    // In a real implementation, we'd check session and renter_org_id mapping
    // const { data: { user } } = await supabase.auth.getUser();
    
    const { data: recording } = await supabase
        .from('call_recordings')
        .select('recording_url_internal, calls(renter_org_id)')
        .eq('id', recordingId)
        .single();

    if (!recording || !recording.recording_url_internal) {
        return new Response('Not Found', { status: 404 });
    }

    // 2. Fetch from private storage / Twilio and proxy
    // For MVP, we redirect to a pre-signed URL or proxy the stream
    // return Response.redirect(recording.recording_url_internal);

    // Secure Proxy Placeholder
    try {
        const response = await fetch(recording.recording_url_internal);
        const { readable, writable } = new TransformStream();
        response.body?.pipeTo(writable);
        
        return new Response(readable, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
                'Cache-Control': 'no-cache'
            }
        });
    } catch (e) {
        return new Response('Proxy Error', { status: 500 });
    }
};
