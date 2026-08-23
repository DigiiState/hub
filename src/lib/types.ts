export interface RenterOrganization {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

export interface RenterMembership {
    id: string;
    organization_id: string;
    profile_id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    created_at: string;
}

export interface TrackingNumber {
    id: string;
    twilio_phone_number: string;
    twilio_sid: string;
    asset_id: string;
    renter_org_id: string;
    territory_id: string;
    forwarding_destination: string;
    assignment_start: string;
    assignment_end?: string;
    status: 'ACTIVE' | 'RELEASED';
    created_at: string;
}

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer' | 'canceled';

export interface Call {
    id: string;
    twilio_call_sid: string;
    direction: CallDirection;
    caller_number: string;
    destination_number: string;
    started_at: string;
    answered_at?: string;
    ended_at?: string;
    duration?: number;
    status: CallStatus;
    renter_org_id: string;
    asset_id: string;
    territory_id: string;
    lead_id?: string;
    created_at: string;
    updated_at: string;
}

export interface CallRecording {
    id: string;
    call_id: string;
    twilio_recording_sid: string;
    recording_url_internal?: string;
    duration?: number;
    status: string;
    recording_policy?: string;
    notice_consent_applied: boolean;
    retention_status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    started_at?: string;
    created_at: string;
}

export interface LeadEvent {
    id: string;
    lead_id: string;
    previous_state?: string;
    new_state: string;
    actor_id?: string;
    source: 'renter_portal' | 'api' | 'system';
    metadata?: any;
    timestamp: string;
}

export interface MissedCallTask {
    id: string;
    call_id: string;
    renter_org_id: string;
    follow_up_required: boolean;
    recovery_authorized: boolean;
    recovery_status: 'PENDING' | 'ATTEMPTED' | 'SUCCESS' | 'FAILED';
    created_at: string;
}
