# CLOUDFLARE DEPLOYMENT WORKFLOW

This standard defines the mandatory CI/CD pipeline for Astro-based Hub applications on Cloudflare Pages.

## 1. DEVELOPMENT
- **Host**: Local machine.
- **Commands**: `npm run dev`.
- **Supabase**: Dedicated staging instance or local docker.

## 2. FEATURE BRANCH
- Create branch: `feat/...` or `fix/...`.
- Push to GitHub: `git push origin branch-name`.

## 3. CLOUDFLARE PREVIEW
- **Trigger**: Automatic on branch push.
- **Verification**:
  - **Browser QA**: Interactive functional check of new feature.
  - **Visual QA**: Capture Desktop/Mobile screenshots.
  - **Regression**: Test core metrics and dashboard access.
  - **Gatekeeper**: Independent audit (mapped to `verification` agent).

## 4. PRODUCTION GATEKEEPER
- Final sign-off required on the Preview URL.
- Verdict: **PRODUCTION READY — PASS**.

## 5. CLOUDFLARE PRODUCTION
- **Trigger**: Merge to `main`.
- **Commands**: `git checkout main`, `git merge branch`, `git push origin main`.
- **Post-Deploy**: Smoke test of the live `digiistate.com` domain.

## 💾 Rollback Protocol
- **Method**: Cloudflare Dashboard -> Deployments -> Rollback to previous "Ready" build.
- **Git Revert**: Immediate `git revert HEAD` and push to main for permanent restoration.
