# GEMINI.md — Antigravity-specific overrides

This file takes precedence over AGENTS.md in Antigravity. **Follow all of `AGENTS.md` first**, then the points below.

## Antigravity behavior
- Use **Planning mode**: produce an implementation plan (files to create/change per phase) before writing code, then execute.
- Work on one phase from `docs/10-implementation-plan.md` at a time. Do not start the next phase until lint, type-check and build pass.
- Use the integrated terminal to run `npm install`, builds, seed, and tests yourself; read the output and fix failures.
- When the UI is built, run the dev servers and verify pages in the browser at 1280px and 390px widths (login, dashboard, doctors, doctor detail, patients). Capture screenshots into `docs/screenshots/` using clear names (`desktop-dashboard.png`, `mobile-dashboard.png`, ...).
- Keep artifacts concise: task list mirrors `docs/10`, walkthrough summarizes what changed and how it was verified.
- Do not run destructive commands (dropping non-local databases, `rm -rf` outside the repo, force-push). Only seed against the database in `server/.env`.
- Available slash workflows: `/build-phase`, `/verify`, `/finish-readme` (see `.agent/workflows/`).
