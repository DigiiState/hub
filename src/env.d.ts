/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly TWILIO_AUTH_TOKEN: string;
    readonly TWILIO_ACCOUNT_SID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
