# ARCHITECTURE

## System Overview
DigiiState OS (Hub) is a static-first management portal built with Astro.js and deployed on Cloudflare Pages.

## Frontend Architecture
- **Framework**: Astro.js (Hybrid SSR/Static)
- **State Management**: `src/lib/db.ts` acts as the interface for system data.
- **Styling**: Tailwind CSS ( Bloomberg aesthetic: dark mode, high data density).
- **Authentication**: Cookie-based Edge Middleware (`functions/_middleware.ts`).

## Backend Architecture
- **Database**: Supabase PostgreSQL (Target). Current state: static JSON in `src/lib/db.ts`.
- **Logic**: Edge functions on Cloudflare for middleware and light API proxying.

## Service Boundaries
- **Cloudflare**: Hosting, CDN, Edge Compute.
- **Supabase**: Persistent System of Record (Users, Portfolio, Logs).
- **External APIs**: Twilio, Serper.dev, Make.com.

## Security
- **Auth**: Supabase Auth (Email/Password).
- **Session**: Secure cookie-based session verification (`DS_SESSION`).
- **Data Access**: Row Level Security (RLS) in Supabase.
