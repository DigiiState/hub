# DigiiState OS — Engineering Handoff

## 🏛️ Project Baseline
*   **Workspace Path:** `/Users/lydiai/Desktop/Lori Home/ventures/DigiiState/hub`
*   **GitHub Repository:** `https://github.com/DigiiState/hub.git`
*   **Production Branch:** `main`
*   **Production Commit:** `6a94ec8b52edeb6b364864b8c7815ca4eb894342`
*   **Infrastructure:** Cloudflare Pages (v1.1.0)
*   **Custom Domain:** `digiistate.com`

## 🏗️ Architecture
*   **Framework:** Astro.js (Static-first with Edge Middleware)
*   **Design System:** Tailwind CSS (Institutional "Bloomberg" Aesthetic)
*   **State Management:** `src/lib/db.ts` (Authoritative Source of Truth)
*   **Authentication:** Cookie-based Edge Middleware (`functions/_middleware.ts`)
*   **Auth Key:** `08152026` (DS_AUTH)

## 📡 Integrations
*   **Hosting/DNS:** Cloudflare (Pages + Registrar)
*   **Lead Routing:** Make.com (Lead Proxy Webhook)
*   **Telecom:** Twilio (Voice Engine & Tracking)
*   **Rankings:** Serper.dev (Quad-Pulse API)
*   **Database:** Supabase (Schema prepared, live sync pending)

## 🗄️ Database Status
*   **Migrations Location:** `/ventures/DigiiState/database/`
*   **Authoritative Files:**
    *   `SUPABASE_SCHEMA.sql` (Core tables)
    *   `ROBUST_EMPIRE_SCHEMA.sql` (Portfolio scaling)
    *   `MIGRATION_PHASE_2_5.sql` (Asset relationships)
*   **Current State:** The Hub currently uses the local `src/lib/db.ts` for all production metrics while awaiting live Supabase credentials.

## ⚙️ Environment Configuration
*   **Build Settings (Cloudflare):**
    *   `NODE_VERSION`: `22.12.0` (Required for build compatibility)
    *   `DS_AUTH`: `08152026` (Operator Access Key)

## 🛑 Known Issues & Unresolved Defects
1.  **Supabase Sync:** Frontend is currently using static JSON state. API integration for live PG data is architected but not connected.
2.  **Legal Content:** Footer links (`Governance`, `TOS`, `Privacy`) point to pages with valid structures but minimal boilerplate content.
3.  **Twilio Verification:** Final "Missed Call" SMS automation requires user-level Twilio account SID injection.
4.  **Ranking API:** Quad-Pulse view relies on Serper.dev; API credits monitor required in Alerts module.

## 🚀 Deployment Baseline
1.  **Commit/Push to GitHub:** Handled via `git push origin main`.
2.  **Cloudflare Build:** Triggered automatically on push.
3.  **Domain Mapping:** All 15 domains are programmatically linked to their respective Pages projects.

---
*Prepared by Lori — System Stabilization Phase: COMPLETE.*
