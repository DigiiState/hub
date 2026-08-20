# INFRASTRUCTURE AUDIT: Architectural Defect — Supabase Shared Project

## 🛑 Defect Classification: ARCHITECTURAL CRITICAL
- **Summary**: DigiiState Hub is currently sharing a Supabase project (`scrqdnpyditpscsehizd`) with the WebDev OS TestBench/Certification application.
- **Impact**: Cross-application data pollution, risk of accidental deletion during OS resets, and lack of production-grade isolation.

## 🏛️ Current State (Project: `scrqdnpyditpscsehizd`)

### Tables & Records
| Table | Records | Purpose |
| :--- | :--- | :--- |
| `assets` | 6 | Domain metadata & Digital Deeds. |
| `territories` | 6 | Geographic market definitions (Legacy). |
| `leads` | 3 | Revenue attribution data. |
| `rankings` | 6 | Quad-Pulse search performance. |
| `leases` | 0 | Partner agreements. |
| `asset_financials` | 0 | Asset-level P&L. |

### Dependencies
- **Frontend**: Astro Hub `src/lib/supabase.ts` singleton.
- **Auth**: Cookie-based middleware depends on this instance for profile verification.
- **Storage**: `project-documents` bucket resides in this shared project.

## 🚀 Migration Plan (Target: Dedicated Project)

### 1. Requirements
- New Supabase Project created specifically for DigiiState.
- Dedicated URL and API Keys.

### 2. Execution Procedure
1. **Schema Export**: Extract SQL from `/database/` and existing migrations.
2. **Data Backup**: Export existing 21 records via CSV or SQL dump.
3. **Environment Update**: Update `.env` in `hub/` and Cloudflare Pages variables.
4. **Validation**: Execute `live_verify.js` against the NEW project.

### 3. Rollback Plan
- Retain existing data in the shared project for 7 days post-migration.
- Maintain a git branch with the old `scrqdnpyditpscsehizd` credentials for emergency revert.

## 💾 Backup Requirements
- Weekly automated SQL dumps.
- Full backup before any destructive `DROP TABLE` or `git reset` on the shared project.
